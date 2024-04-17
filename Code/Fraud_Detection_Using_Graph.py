import numpy as np
import pandas as pd
from py2neo import Graph
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import StratifiedKFold
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report
from imblearn.over_sampling import SMOTE

# Function to fetch network-based features from a record
def load_feature(record, feature_name):
    """ Extracts specified feature for a record. """
    key = record.split("'")[1]
    return records[key][feature_name]

# Load the dataset
banksim_df = pd.read_csv("../Data/bs140513_032310.csv")

# Attempt to connect to the Neo4j database
try:
    graph = Graph("bolt://127.0.0.1:7687", auth=("neo4j", "root1234"))
    print("Successfully connected to the database.")
except Exception as e:
    print(f"An error occurred: {e}")

# Fetch network features from Neo4j
query = """
MATCH (p:Placeholder)
RETURN p.id AS id, p.degree AS degree, p.pagerank as pagerank, p.community AS community
"""
data = graph.run(query)

records = {}

for record in data:
    records[record['id']] = {'degree': record['degree'], 'pagerank': record['pagerank'], 'community': record['community']}

for feature in ['degree', 'pagerank', 'community']:
    banksim_df[f'merchant_{feature}'] = banksim_df['merchant'].apply(lambda x: load_feature(x, feature))
    banksim_df[f'customer_{feature}'] = banksim_df['customer'].apply(lambda x: load_feature(x, feature))

# Prepare features and labels for machine learning
labels = banksim_df['fraud'].values
feature_df = banksim_df.drop(['step', 'age', 'gender', 'customer', 'zipcodeOri', 'zipMerchant', 'fraud'], axis=1)
feature_df = pd.get_dummies(feature_df)

# Standardize the feature dataset
scaler = StandardScaler()
scaled_df = scaler.fit_transform(feature_df)

# Set up cross-validation
k_fold = StratifiedKFold(n_splits=5, shuffle=False)
models = {
    'Random Forest': RandomForestClassifier(max_depth=20, n_estimators=150),
    'SVM': SVC(gamma="auto"),
    'Logistic Regression': LogisticRegression(solver='lbfgs', max_iter=5000)
}

# Function to train and evaluate models
def train_and_evaluate(model, name):
    print(f"\n\nBuilding {name} classifier with k=5 folds")
    for train_index, test_index in k_fold.split(scaled_df, labels):
        X_train, X_test = scaled_df[train_index], scaled_df[test_index]
        y_train, y_test = labels[train_index], labels[test_index]

        # Handle class imbalance using SMOTE
        sm = SMOTE()
        X_train_smote, y_train_smote = sm.fit_resample(X_train, y_train)

        # Train the model
        clf = model.fit(X_train_smote, y_train_smote)
        predictions = clf.predict(X_test)
        print(classification_report(y_test, predictions))

# Train and evaluate each model
for name, model in models.items():
    train_and_evaluate(model, name)