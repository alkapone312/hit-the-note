import { PipelineSettings } from "./Settings";

abstract class StreamNode<T, R> {
    private nodes: StreamNode<R, unknown>[] = [];

    protected settings: PipelineSettings;

    public connect(node: StreamNode<R, unknown>) {
        this.nodes.push(node);
    }

    public abstract accept(data: T);
    
    protected broadcast(data: R) {
        this.nodes.forEach(node => node.accept(data));
    }

    public setSettings(settings: PipelineSettings) {
        this.settings = settings;
    }
}

export default StreamNode;