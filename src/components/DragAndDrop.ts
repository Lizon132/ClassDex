export function createElem(tag: string, props?: any, ...children: (HTMLElement | string)[]): HTMLElement {
    const elem = document.createElement(tag);

    if (children) elem.append(...children);

    for (let key in props) {
        (elem as any)[key] = props[key];
    }

    return elem;
}


export type OnDragFunc = (before: number, after: number, container: HTMLElement) => void;

type Props = {
    finishFunc: OnDragFunc,
    container: HTMLElement,
    beforeIdx: number,
    nowIdx: number,
    element: HTMLElement,
    height: number,
    yOffset: number,
};

let props: Props | null = null;


const fillerElem = document.createElement("div");
fillerElem.classList.add("filler-item");
fillerElem.innerText = "-";


function rootElem(): HTMLElement {
    return document.getElementsByTagName("html")[0];
}

// Get the index of an element in it's parent
function getChildElementIndex(child: HTMLElement): number {
    const parent = child.parentElement;
    if (!parent) throw new Error("Child does not have parent");

    for (let i = 0 ; i < parent.children.length ; i++) {
        if (parent.children.item(i) === child) return i;
    }

    throw new Error("Child is not in parent");
}

// Get the element order
function displayElementOrder(hoverElem: HTMLElement) {
    if (!props) throw new Error("No props");

    const newElemOrder: Element[] = [];
    for (let i = 0 ; i <= props.container.children.length ; i++) {
        if (newElemOrder.length === props.nowIdx) {
            newElemOrder.push(hoverElem);
        }

        const item = props.container.children[i];
        if (item && item !== props.element && !item.classList.contains("filler-item")) {
            newElemOrder.push(item);
        }
    }

    props.container.replaceChildren(...newElemOrder);
}


export function createGrabber(func: OnDragFunc): HTMLElement {
    const grabber = createElem(
        "span", { className: "grabber" }, "⠿"
    );

    grabber.addEventListener("mousedown", (event) => {
        const elem = getDraggableElement(grabber);
        if (elem === null) throw new Error("Grabber is not in container!");

        onDragStart(elem, func, (event as MouseEvent).pageY, (event as MouseEvent).clientY);
    });

    grabber.addEventListener("touchstart", (event) => {
        const elem = getDraggableElement(grabber);
        if (elem === null) throw new Error("Grabber is not in container!");

        const touch = (event as TouchEvent).touches[0];
        onDragStart(elem, func, touch.pageY, touch.clientY);
    });

    return grabber;
}

function getDraggableElement(elem: HTMLElement, container?: HTMLElement): HTMLElement | null {
    const parent = elem.parentElement;
    if (!parent) return null;

    if (container) {
        if (parent === container) return elem;
    } else {
        if (parent.classList.contains("drag-container")) return elem;
    }

    return getDraggableElement(parent, container);
}

function onDragStart(child: HTMLElement, func: OnDragFunc, y: number, cy: number) {
    // If there are props already, end the previous drag
    if (props) onDragEnd();

    rootElem().style.userSelect = "none";
    rootElem().style.touchAction = "none";

    const childIdx = getChildElementIndex(child);
    const childRect = child.getBoundingClientRect();

    props = {
        finishFunc: func,
        nowIdx: childIdx,
        beforeIdx: childIdx,
        container: child.parentElement!,
        element: child,
        height: childRect.height,
        yOffset: childRect.top - cy,
    };

    // Setup the filler element
    fillerElem.style.height = childRect.height + "px";
    child.parentElement!.replaceChild(fillerElem, child);

    // Set up the dragging element
    props.element.classList.add("dragging-item");
    props.element.style.left = childRect.left + "px";
    props.element.style.width = childRect.width*0.9 + "px";
    child.style.top = (y + props.yOffset + props.height/2) + "px";
    rootElem().appendChild(child);
}


document.addEventListener("mousemove", (event) => {
    if (!props || !(event.target instanceof HTMLElement)) return;

    onDragMove(event.target, event);
});

document.addEventListener("touchmove", (event) => {
    if (!props) return;

    const touch = event.changedTouches[0];

    const target = document.elementFromPoint(touch.pageX, touch.pageY);
    if (!target) return;

    if (target instanceof HTMLElement) {
        onDragMove(target, event.touches[0]);
    } else if (target.parentElement) {
        onDragMove(target.parentElement, event.touches[0]);
    }
});

function onDragMove(topTarget: HTMLElement, event: { pageY: number, clientY: number }) {
    if (!props) return;

    const y = event.pageY + props.yOffset + props.height/2;
    const cy = event.clientY + props.yOffset + props.height/2;

    // No matter what, make sure the dragging element is at the right height
    props.element.style.top = y + "px";

    // Find the child of the container that the cursor is over, or if
    // it is outside of the container, exit
    const target = getDraggableElement(topTarget, props.container);
    if (!target) return;
    // if ((target as any).domPath) console.log((target as any).domPath, target);

    const targetIdx = getChildElementIndex(target);
    const rect = target.getBoundingClientRect();
    const halfY = rect.top + rect.height/2;
    const halfH = props.height/2;

    if (target === fillerElem) {
        if (cy < halfY) {
            // Move down if the bottom of the floating element is
            // below the middle of the element below it
            if (targetIdx === 0) return;
            const aboveRect = props.container.children[targetIdx - 1].getBoundingClientRect();
            const aboveMiddleY = aboveRect.top + aboveRect.height/2;
            const floatingTop = cy - halfH;
            if (floatingTop > aboveMiddleY) return;
            props.nowIdx -= 1;
        } else {
            // Move up if the top of the floating element is above the
            // middle of the element above it
            if (targetIdx >= props.container.children.length-1) return;
            const belowRect = props.container.children[targetIdx + 1].getBoundingClientRect();
            const belowMiddleY = belowRect.top + belowRect.height/2;
            const floatingBottom = cy + halfH;
            if (floatingBottom < belowMiddleY) return;
            props.nowIdx += 1;
        }
    } else {
        // If the target is above, and mouse is below
        if (targetIdx < props.nowIdx && cy >= halfY+halfH) return;
        // If the target is below, and mouse is below
        if (targetIdx > props.nowIdx && cy <= halfY-halfH) return;

        props.nowIdx = targetIdx;
    }

    // Display the elements, then re-add the dragging element to the container
    displayElementOrder(fillerElem);
}


document.addEventListener("mouseup", onDragEnd);
document.addEventListener("touchend", onDragEnd);

function onDragEnd() {
    if (!props) return;

    // props.element.style.left = undefined;
    props.element.style.width = null;

    rootElem().style.userSelect = "";
    rootElem().style.touchAction = "";

    rootElem().removeChild(props.element);
    props.element.classList.remove("dragging-item");

    // Move the element to its new position
    displayElementOrder(props.element);

    // Run the hook provided to be run upon finishing the drag
    props.finishFunc(props.beforeIdx, props.nowIdx, props.container);

    props = null;

}
