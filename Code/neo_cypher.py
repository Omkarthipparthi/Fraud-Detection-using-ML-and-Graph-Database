from neo4j import GraphDatabase

uri = "bolt://localhost:7687"  # Replace with your connection URI
user = "neo4j"                 # Replace with your username
password = "root1234"           # Replace with your password

query = """
CALL {
  LOAD CSV WITH HEADERS FROM "file:///bs140513_032310.csv" AS line FIELDTERMINATOR ','
  WITH line,
  SPLIT(line.customer, "'") AS customerID,
  SPLIT(line.merchant, "'") AS merchantID,
  SPLIT(line.age, "'") AS customerAge,
  SPLIT(line.gender, "'") AS customerGender,
  SPLIT(line.category, "'") AS transCategory
  MERGE (customer:Customer {id: customerID[1]})
    ON CREATE SET customer.age = customerAge[1], customer.gender = customerGender[1]
  MERGE (merchant:Merchant {id: merchantID[1]})
  MERGE (transaction:Transaction {step: toInteger(line.step)})
    ON CREATE SET transaction.amount = toFloat(line.amount), 
                  transaction.fraud = toInteger(line.fraud), 
                  transaction.category = transCategory[1]
  MERGE (customer)-[:PERFORMS]->(transaction)
  MERGE (transaction)-[:WITH]->(merchant)
} IN TRANSACTIONS OF 1000 ROWS;
"""

# Connect to the database
driver = GraphDatabase.driver(uri, auth=(user, password))

# Run the query in auto-commit mode
with driver.session() as session:
    session.run(query)