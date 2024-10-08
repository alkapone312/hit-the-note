import { PipelineSettings } from "./Settings";

abstract class StreamNode {
    private nodes: StreamNode[] = [];

    protected settings: PipelineSettings;

    public connect(node: StreamNode) {
        this.nodes.push(node);
    }

    public abstract accept(data: Float32Array);
    
    protected broadcast(data: Float32Array): void {
        this.nodes.forEach(node => {node.accept(data)});
    }

    public setSettings(settings: PipelineSettings): void {
        this.settings = settings;
    }
}

export default StreamNode;