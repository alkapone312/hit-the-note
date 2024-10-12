import type {PipelineSettings} from './Settings.js';

abstract class StreamNode {
    protected settings: PipelineSettings;
    
    private readonly nodes: StreamNode[] = [];

    public connect(node: StreamNode): void {
        this.nodes.push(node);
    }
    
    public setSettings(settings: PipelineSettings): void {
        this.settings = settings;
    }
    
    protected broadcast(data: Float32Array): void {
        this.nodes.forEach(node => {
            node.accept(data); 
        });
    }

    public abstract accept(data: Float32Array): void;
}

export default StreamNode;