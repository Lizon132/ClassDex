import { ReactNode, useState } from "react";
import Draggable from "react-draggable";

export default function TwoColumns(left: ReactNode, right: ReactNode) {
    const [width, setWidth] = useState(600); // Initial width in percentage

    const handleDrag = (e: DragEvent) => {
        // Calculate the new left column width based on the drag delta
        const newWidth = Math.max(200, Math.min(e.pageX, window.screen.width-200));
        (document.getElementsByClassName("left-column")[0] as HTMLElement).style.width = `${newWidth}px`;
        // (document.getElementsByClassName("separator")[0] as HTMLElement).style.left = `${newWidth}px`;
        // setWidth(newWidth);
    };

    return (
        <div>
            <div className="draggable-columns">
                <div className="left-column" style={{ width: `${width}px` }}>{left}</div>
                <div className="right-column">{right}</div>
            </div>
            <Draggable axis="x" onDrag={handleDrag} bounds={{ left: 200 - width }}>
                <div className="separator" />
            </Draggable>
        </div>
    );
}

