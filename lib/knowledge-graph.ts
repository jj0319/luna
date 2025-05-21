/**
 * Knowledge Graph System
 *
 * Stores and connects concepts in a graph structure for semantic understanding
 */

interface Node {
  id: string
  type: string
  properties: Record<string, any>
}

interface Edge {
  source: string
  target: string
  type: string
  weight: number
  properties: Record<string, any>
}

export class KnowledgeGraph {
  private nodes: Map<string, Node> = new Map()
  private edges: Map<string, Edge[]> = new Map()
  private initialized = false

  constructor() {
    // Initialize empty graph
  }

  /**
   * Initialize the knowledge graph
   */
  async initialize(): Promise<void> {
    try {
      // Load from localStorage if available
      if (typeof window !== "undefined") {
        const savedNodes = localStorage.getItem("knowledgeGraph_nodes")
        const savedEdges = localStorage.getItem("knowledgeGraph_edges")

        if (savedNodes && savedEdges) {
          this.nodes = new Map(JSON.parse(savedNodes))
          this.edges = new Map(JSON.parse(savedEdges))
        }
      }

      this.initialized = true
    } catch (error) {
      console.error("Error initializing KnowledgeGraph:", error)
      throw error
    }
  }

  /**
   * Check if the knowledge graph is initialized
   */
  isInitialized(): boolean {
    return this.initialized
  }

  /**
   * Add a node to the graph
   */
  addNode(node: Node): void {
    this.nodes.set(node.id, node)
    if (!this.edges.has(node.id)) {
      this.edges.set(node.id, [])
    }
    this.saveToStorage()
  }

  /**
   * Add an edge between two nodes
   */
  addEdge(edge: Edge): void {
    if (!this.nodes.has(edge.source) || !this.nodes.has(edge.target)) {
      throw new Error("Source or target node does not exist")
    }

    const sourceEdges = this.edges.get(edge.source) || []
    sourceEdges.push(edge)
    this.edges.set(edge.source, sourceEdges)
    this.saveToStorage()
  }

  /**
   * Extract concepts from text and add them to the knowledge graph
   */
  extractAndAddConcepts(text: string): string[] {
    // Simple concept extraction (in a real system, this would be more sophisticated)
    const concepts = this.extractConcepts(text)

    // Add concepts to graph
    for (const concept of concepts) {
      const nodeId = `concept:${concept}`
      if (!this.nodes.has(nodeId)) {
        this.addNode({
          id: nodeId,
          type: "concept",
          properties: {
            name: concept,
            occurrences: 1,
          },
        })
      } else {
        const node = this.nodes.get(nodeId)!
        node.properties.occurrences = (node.properties.occurrences || 0) + 1
        this.nodes.set(nodeId, node)
      }
    }

    // Connect related concepts
    for (let i = 0; i < concepts.length; i++) {
      for (let j = i + 1; j < concepts.length; j++) {
        const sourceId = `concept:${concepts[i]}`
        const targetId = `concept:${concepts[j]}`

        // Check if edge already exists
        const sourceEdges = this.edges.get(sourceId) || []
        const existingEdge = sourceEdges.find((e) => e.target === targetId)

        if (existingEdge) {
          existingEdge.weight += 1
        } else {
          this.addEdge({
            source: sourceId,
            target: targetId,
            type: "related",
            weight: 1,
            properties: {
              cooccurrence: 1,
            },
          })
        }
      }
    }

    this.saveToStorage()
    return concepts
  }

  /**
   * Extract concepts from text
   */
  private extractConcepts(text: string): string[] {
    // Simple concept extraction based on noun phrases
    // In a real system, this would use NLP techniques

    // Remove punctuation and convert to lowercase
    const cleanText = text.toLowerCase().replace(/[^\w\s]/g, "")

    // Split into words
    const words = cleanText.split(/\s+/)

    // Filter out common stop words
    const stopWords = new Set([
      "the",
      "a",
      "an",
      "and",
      "or",
      "but",
      "is",
      "are",
      "was",
      "were",
      "be",
      "been",
      "being",
      "to",
      "of",
      "for",
      "with",
      "by",
      "about",
      "against",
      "between",
      "into",
      "through",
      "during",
      "before",
      "after",
      "above",
      "below",
      "from",
      "up",
      "down",
      "in",
      "out",
      "on",
      "off",
      "over",
      "under",
      "again",
      "further",
      "then",
      "once",
      "here",
      "there",
      "when",
      "where",
      "why",
      "how",
      "all",
      "any",
      "both",
      "each",
      "few",
      "more",
      "most",
      "other",
      "some",
      "such",
      "no",
      "nor",
      "not",
      "only",
      "own",
      "same",
      "so",
      "than",
      "too",
      "very",
      "s",
      "t",
      "can",
      "will",
      "just",
      "don",
      "should",
      "now",
    ])

    const concepts = words.filter((word) => word.length > 3 && !stopWords.has(word))

    // Return unique concepts
    return [...new Set(concepts)].slice(0, 10)
  }

  /**
   * Get the number of nodes in the graph
   */
  getNodeCount(): number {
    return this.nodes.size
  }

  /**
   * Get the number of edges in the graph
   */
  getEdgeCount(): number {
    let count = 0
    for (const edges of this.edges.values()) {
      count += edges.length
    }
    return count
  }

  /**
   * Get the number of concept nodes in the graph
   */
  getConceptCount(): number {
    let count = 0
    for (const node of this.nodes.values()) {
      if (node.type === "concept") {
        count++
      }
    }
    return count
  }

  /**
   * Save the graph to localStorage
   */
  private saveToStorage(): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("knowledgeGraph_nodes", JSON.stringify([...this.nodes.entries()]))
      localStorage.setItem("knowledgeGraph_edges", JSON.stringify([...this.edges.entries()]))
    }
  }

  /**
   * Convert the graph to JSON
   */
  toJSON(): string {
    return JSON.stringify({
      nodes: [...this.nodes.entries()],
      edges: [...this.edges.entries()],
    })
  }

  /**
   * Load the graph from JSON
   */
  fromJSON(json: string): void {
    const data = JSON.parse(json)
    this.nodes = new Map(data.nodes)
    this.edges = new Map(data.edges)
    this.initialized = true
  }
}
