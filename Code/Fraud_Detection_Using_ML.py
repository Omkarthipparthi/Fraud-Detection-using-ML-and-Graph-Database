import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.model_selection import StratifiedKFold
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report
from imblearn.over_sampling import SMOTE

# Load the dataset
banksim_df = pd.read_csv("../data/bs140513_032310.csv")

# Labels for the dataset
labels = banksim_df['fraud'].values

# Preprocess and prepare the dataset
def preprocess_data(df):
    """
    Prepares the dataset by removing unnecessary columns, encoding categorical variables,
    and standardizing the feature set.
    """
    # Dropping columns that are not needed or are redundant
    df = df.drop(['step', 'customer', 'zipcodeOri', 'zipMerchant', 'fraud'], axis=1)

    # One hot encoding the categorical variables
    df = pd.get_dummies(df, columns=['age', 'gender', 'category', 'merchant'])

    # Standardizing the features
    scaler = StandardScaler()
    return scaler.fit_transform(df)

# Prepare the feature set
feature_df = preprocess_data(banksim_df)

# Dimensionality reduction with PCA to retain 95% of variance
pca = PCA(0.95)
scaled_df = pca.fit_transform(feature_df)

# Define and setup the machine learning models
models = {
    'Random Forest': RandomForestClassifier(max_depth=20, n_estimators=150),
    'SVM': SVC(gamma='auto'),
    'Logistic Regression': LogisticRegression(solver='lbfgs', max_iter=5000)
}

# Cross-validation and model training
def train_and_evaluate(models, features, labels):
    """
    Trains the specified models using Stratified K-Fold cross-validation,
    handles class imbalance using SMOTE, and prints classification reports.
    """
    k_fold = StratifiedKFold(n_splits=5, shuffle=False)

    for name, model in models.items():
        print(f"\n\nBuilding {name} classifier with k=5 folds")
        for train_index, test_index in k_fold.split(features, labels):
            X_train, X_test = features[train_index], features[test_index]
            y_train, y_test = labels[train_index], labels[test_index]

            # Handling the imbalance in the dataset using SMOTE
            sm = SMOTE()
            X_train_smote, y_train_smote = sm.fit_resample(X_train, y_train)

            # Training the model
            clf = model.fit(X_train_smote, y_train_smote)
            predictions = clf.predict(X_test)
            print(classification_report(y_test, predictions))

# Execute the training and evaluation
train_and_evaluate(models, scaled_df, labels)