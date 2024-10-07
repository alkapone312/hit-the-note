
abstract class StreamNode<T, R> {
    private nodes: StreamNode<R, unknown>[] = [];

    public connect(node: StreamNode<R, unknown>) {
        this.nodes.push(node);
    }

    public abstract accept(data: T);
    
    protected broadcast(data: R) {
        this.nodes.forEach(node => node.accept(data));
    }
}

export default StreamNode;