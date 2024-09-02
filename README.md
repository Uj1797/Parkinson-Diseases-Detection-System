# Parkinson's Disease Prediction Model

## Project Overview

This repository contains a machine learning model developed to predict Parkinson's disease using patient voice recordings. The project utilizes a Support Vector Machine (SVM) to analyze biomedical datasets and make accurate diagnoses. This work is aimed at leveraging the subtle differences in voice patterns to identify whether a person is likely to have Parkinson's disease, offering a non-invasive diagnostic tool.

## Dataset

### Dataset Source

The dataset for this project was sourced from [Kaggle](https://www.kaggle.com), a platform offering diverse datasets for machine learning projects. It includes voice recordings from patients, with attributes related to various acoustic properties that can indicate the presence of Parkinson's disease.

### Dataset Summary

The dataset comprises two main types of data:

- Voice Features: Various acoustic properties derived from patient voice recordings.
- Diagnosis Label: A binary label indicating the presence or absence of Parkinson's disease.

## Tools and Libraries

The project was developed using the following tools and Python libraries:

- Python: Programming language used for the entire project.
- Jupyter Notebook: For creating and running the code in an interactive environment.
- Pandas: For data manipulation and preprocessing.
- NumPy: For numerical computations.
- Scikit-learn: For implementing the Support Vector Machine and other machine learning tasks.
- Matplotlib: For plotting and visualizing data (optional, based on your use).

## Methodology

### Data Preprocessing

- Loading Data: The dataset was imported from Kaggle into a Jupyter Notebook environment.
- Exploratory Data Analysis (EDA): Analyzed the distribution and relationships of the various acoustic features.
- Data Cleaning: Handled any missing values and ensured the dataset was formatted correctly for machine learning.
- Feature Scaling: Applied standardization to the data to improve the SVM model performance.

### Model Development

- Support Vector Machine (SVM): Chosen for its effectiveness in binary classification tasks.
- Model Training: The SVM model was trained using the labeled dataset.
- Model Evaluation: Performed cross-validation and evaluated the model using accuracy, precision, recall.

### Prediction

The model predicts whether a patient has Parkinson's disease based on their voice readings. Given a new set of voice feature inputs, the model outputs a binary prediction: 1 for Parkinson's disease presence, 0 for absence.

## Results

- Accuracy: The model achieved an accuracy of X% (replace with your actual result) on the test dataset.
- Precision & Recall: The precision and recall metrics indicated the model's reliability in diagnosing Parkinson's disease.
- Confusion Matrix: A confusion matrix was plotted to visualize the model's performance.

## Conclusion

The Parkinson's Disease Prediction Model demonstrates the potential of using voice recordings as a diagnostic tool for neurodegenerative diseases. By employing SVM and various data analysis techniques, the project provides a non-invasive method for early detection of Parkinson's disease, which could be valuable for clinical settings.

## Future Work

- Model Optimization: Explore other machine learning models and hyperparameter tuning to improve accuracy.
- Feature Engineering: Investigate additional voice features or other types of biomedical data for better prediction performance.
- Real-world Application: Collaborate with healthcare professionals to validate the model's effectiveness in clinical trials.

## How to Run the Project

### Prerequisites

- Python 3.0 
- Jupyter Notebook or any Python IDE
- Required Python libraries
