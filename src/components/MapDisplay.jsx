import React, { useRef, useEffect, useState } from 'react';

const MapDisplay = ({canvasPoint}) =>{
    const parentRef = useRef(null);
    const canvasRef = useRef(null);
    const [points, setPoints] = useState([]);
    const [isDrawingComplete, setIsDrawingComplete] = useState(false);

    useEffect(() => {
        const parentElement = parentRef.current;
        const canvasElement = canvasRef.current;

        if (parentElement && canvasElement) {
            const parentWidth = parentElement.offsetWidth;
            canvasElement.width = parentWidth;
            canvasElement.height = parentElement.offsetHeight;
        }
    }, []);

    useEffect(() => {
        if (canvasPoint.x && canvasPoint.y) {
            setPoints((prev) => [...prev, { x: canvasPoint.x, y: canvasPoint.y }]);
        }
    }, [canvasPoint]);

    useEffect(() => {
        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d');
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height); // Clear the canvas
    
          ctx.strokeStyle = 'blue';
          ctx.lineWidth = 6;
          ctx.fillStyle = 'red';
    
          // Draw the lines and dots
          points.forEach((point, index) => {
            if (index > 0) {
              // Draw line from previous point to the current point
              const prevPoint = points[index - 1];
              ctx.beginPath();
              ctx.moveTo(prevPoint.x, prevPoint.y);
              ctx.lineTo(point.x, point.y);
              ctx.stroke();
            }
    
            // Draw the dot at the current point
            ctx.beginPath();
            ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
            ctx.fill();
          });
    
          // If drawing is complete, close the polygon
          if (isDrawingComplete && points.length > 1) {
            const firstPoint = points[0];
            const lastPoint = points[points.length - 1];
    
            // Draw line from the last point back to the first point to close the polygon
            ctx.beginPath();
            ctx.moveTo(lastPoint.x, lastPoint.y);
            ctx.lineTo(firstPoint.x, firstPoint.y);
            ctx.stroke();
          }
        }
      }, [points, isDrawingComplete]);

  return (
    <div className="h-full w-full overflow-hidden">
        <div ref={parentRef} className="h-full w-full absolute">
            <canvas
                ref={canvasRef}
                style={{ border: '1px solid black' }}
            />
        </div>
        <iframe
        width="750px"
        height="360px"
        frameBorder="0"
        scrolling="no"
        marginHeight="0"
        marginWidth="0"
        src={`https://maps.google.com/maps?q=38.91744352305618%2C-104.85554968411613&output=embed`}
        className=""
        ></iframe>
    </div>
  );
}

export default MapDisplay;