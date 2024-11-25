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
    
    public reset(): void {
        const nodesLength = this.nodes.length;
        for (let i = 0 ; i < nodesLength; i++) {
            this.nodes.pop();
        }
    }
    
    protected broadcast(data: Float32Array): void {
        this.nodes.forEach(node => {
            node.accept(data); 
        });
    }
    
    public abstract accept(data: Float32Array): void;
}

export default StreamNode;