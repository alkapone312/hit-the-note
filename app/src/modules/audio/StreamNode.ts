import type {PipelineSettings} from './Settings.js';

/**
 * Main class of modules, allows connect nodes into a responsibility 
 * chain that will compute signal and pass it further into the system
 */
abstract class StreamNode {

    /**
     * Settings that should be set for each node to work properly
     */
    protected settings: PipelineSettings;
    
    /**
     * List of nodes connected to current node
     */
    private readonly nodes: StreamNode[] = [];

    /**
     * Connect node to this one, to pass the data further.
     * 
     * @param node - Node to pass the data with broadcast method
     */
    public connect(node: StreamNode): void {
        this.nodes.push(node);
    }
    
    /**
     * Set settings of the current node
     */
    public setSettings(settings: PipelineSettings): void {
        this.settings = settings;
    }
    
    /**
     * Disconnect all nodes from this node.
     */
    public reset(): void {
        const nodesLength = this.nodes.length;
        for (let i = 0 ; i < nodesLength; i++) {
            this.nodes.pop();
        }
    }
    
    /**
     * Broadcast data from this node to all connected nodes
     */
    protected broadcast(data: Float32Array): void {
        this.nodes.forEach(node => {
            node.accept(data); 
        });
    }
    
    public abstract accept(data: Float32Array): void;
}

export default StreamNode;