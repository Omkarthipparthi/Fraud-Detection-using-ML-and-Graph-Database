import pandas as pd

# Read the CSV file into a Pandas DataFrame
data = pd.read_csv("Data/bs140513_032310.csv")

# Filter the data for fraud transactions (fraud = 1) and non-fraud transactions (fraud = 0)
fraud1 = data[data['fraud'] == 1]
fraud0 = data[data['fraud'] == 0]

# Find transactions related to customers and merchants involved in fraud transactions
customer_related = pd.concat([fraud0[fraud0['customer'] == cust] for cust in set(fraud1['customer'])])
merchant_related = pd.concat([fraud0[fraud0['merchant'] == mer] for mer in set(fraud1['merchant'])])

# Write the merchant-related data to a new CSV file
merchant_related.to_csv('Data/sampled_dataset.csv', index=False)
