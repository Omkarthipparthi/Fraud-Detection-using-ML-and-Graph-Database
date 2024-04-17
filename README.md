
### Fraud Detection with Graph Databases and Machine Learning
This project was developed for the CSE 573 (Semantic Web Mining) course at Arizona State University during the Spring 2024 semester. The goal is to identify fraudulent activities in banking transactions by leveraging both graph databases and machine learning techniques. The project utilizes the BankSim dataset, a simulated dataset generated from a sample of transaction data from a Spanish bank. The dataset is available on Kaggle: [BankSim Dataset](https://www.kaggle.com/ntnu-testimon/banksim1).

#### Directory Structure
```
.
├── App                    # UI files for the dashboard 
├── Code                    # Python scripts and notebooks
├── Data                     # Contains BankSim data files
└── README.md               # Project overview and setup instructions
```

#### Source Files
- `Code/Data_Pre_Processing.ipynb`: Scripts for preprocessing and cleaning the BankSim dataset to prepare it for analysis and modeling.
- `Code/Fraud_Detection_Using_ML.py`: Builds fraud detection models using intrinsic features from the BankSim dataset.
- `Code/Fraud_Detection_Using_Graph.py`: Develops fraud detection models that utilize both intrinsic and graph-based features.
- `Code/neo4j_graphdb.cyp`: Contains Neo4j queries to create and manage the graph database model with the BankSim dataset.
- `App/index.html`: HTML code for the customer profile dashboard.
- `App/script.js`: JavaScript code essential for the dashboard functionality.

#### Setup and Execution
Execute the following commands in a terminal:

- For models using only intrinsic dataset features:
  ```bash
  python -W ignore Fraud_Detection_Using_ML.py
  ```
- For building the graph database in Neo4j:
  ```bash
  # See neo4j_graphdb.cyp for Neo4j query details
  ```
- For models that incorporate graph-based features:
  ```bash
  python -W ignore Fraud_Detection_Using_Graph.py
  ```
- To launch the Customer Profile dashboard locally:
  ```bash
  python -m http.server 8000
  ```
  Access the dashboard at: [http://localhost:8000/](http://localhost:8000/)

#### Python Libraries
- NumPy - v1.18.1
- Pandas - v0.25.3
- scikit-learn - v0.22.2.post1
- Py2neo - v4.3.0
- imblearn - v0.6.2

### About the Project
This project aims to detect fraud in banking transactions by integrating graph databases with machine learning algorithms.

### Repository Details
- **Stars**: 17
- **Watchers**: 2
- **Forks**: 7
- **Contributors**: Omkar Thipparthi, Anshul Mallick, Jimeet Shah

### Languages Used
- Jupyter Notebook: 90%
- JavaScript: 4.6%
- Python: 4.4%
- HTML: 1%
