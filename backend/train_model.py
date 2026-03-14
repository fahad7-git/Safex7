import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from joblib import dump

# Load dataset
df = pd.read_csv("phishing_dataset.csv")


X = df.drop("label", axis=1)
y = df["label"]

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X, y)

# Save trained model
dump(model, "phishing_model.joblib")

print("✅ Model trained & saved as phish_model.joblib")
