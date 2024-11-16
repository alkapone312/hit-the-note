 
import StreamNode from '@/audio/StreamNode.js';

class VisualiseNode extends StreamNode {
    public constructor(
        private readonly width: number, 
        private readonly height: number, 
        private readonly ctx: CanvasRenderingContext2D
    ) {
        super();
    }

    public accept(data: Float32Array): void {
        const {width} = this;
        const {height} = this;
        const centerY = height / 2;  // Center line (y-axis) for drawing the waveform
        const step = width / data.length;  // Horizontal step between data points
        const maxData = Math.max(...data);
        // Clear the canvas
        this.ctx.clearRect(0, 0, width, height);

        // Set stroke style for the waveform
        this.ctx.strokeStyle = 'blue';
        this.ctx.lineWidth = 2;

        // Begin the path for drawing the waveform
        this.ctx.beginPath();
        for (let i = 0; i < data.length; i++) {
            const x = i * step;
            const y = centerY - data[i] / (maxData != 0 ? maxData : 1) * centerY;  // Scale data to canvas height

            // Move to the first point, then draw lines
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        this.ctx.stroke();  // Draw the path
        this.broadcast(data);
    }

}

export default VisualiseNode;