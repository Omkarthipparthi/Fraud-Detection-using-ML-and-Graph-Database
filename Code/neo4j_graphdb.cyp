// Creating constraints with the newer syntax
CREATE CONSTRAINT customer_id_uniqueness IF NOT EXISTS FOR (c:Customer) REQUIRE c.id IS UNIQUE;
CREATE CONSTRAINT merchant_id_uniqueness IF NOT EXISTS FOR (m:Merchant) REQUIRE m.id IS UNIQUE;

MATCH (c:Customer)-[:PERFORMS]->(t:Transaction)-[:WITH]->(m:Merchant)
WITH c, m, COUNT(*) AS cnt
MERGE (p1:Placeholder {id: m.id})
MERGE (p2:Placeholder {id: c.id})
MERGE (p2)-[:PAYS {cnt: cnt}]->(p1);

CALL gds.graph.list()
YIELD graphName
RETURN graphName
// CALL gds.pageRank.write({
//   nodeProjection: 'Placeholder',
//   relationshipProjection: {
//     PAYS: {
//       type: 'PAYS',
//       orientation: 'UNDIRECTED'
//     }
//   },
//   writeProperty: 'pagerank'
// });


CALL gds.graph.project(
  'myGraphName',
  ['Customer', 'Merchant'],  // An array with the labels of the nodes you want to include
  {
    PAYS: {
      type: 'PAYS',
      orientation: 'UNDIRECTED'
    }
  }
)
YIELD graphName, nodeCount, relationshipCount

MATCH (p:Placeholder)
RETURN p.id AS id, p.pagerank AS pagerank
ORDER BY pagerank DESC;

// Computing the degree of each node
MATCH (p:Placeholder)-[r:PAYS]-()
WITH p, COUNT(r) AS degree
SET p.degree = degree;

// Community detection using label propagation
CALL gds.graph.project(
  'myGraph',
  {
    Placeholder: {
      label: 'Placeholder',
      properties: {} // Add node properties if needed
    }
  },
  {
    PAYS: {
      type: 'PAYS',
      orientation: 'UNDIRECTED'
    }
  }
)
YIELD graphName, nodeCount, relationshipCount;

CALL gds.pageRank.write('myGraph', {
  writeProperty: 'pagerank'
})
YIELD nodePropertiesWritten;

CALL gds.labelPropagation.write('myGraph', {
  writeProperty: 'community'
})
YIELD nodePropertiesWritten;

MATCH (p:Placeholder)
RETURN p.id AS id, p.pagerank AS pagerank
ORDER BY pagerank DESC;

MATCH (p:Placeholder)-[r:PAYS]-()
WITH p, count(r) AS degree
SET p.degree = degree;


MATCH (p:Placeholder)
RETURN p.id AS id, p.pagerank AS pagerank, p.degree AS degree, p.community AS community;

MATCH (c:Customer)-[:PERFORMS]->(t:Transaction)-[:WITH]->(m:Merchant)
WHERE c.id = "C2054744914"
RETURN c, t, m;