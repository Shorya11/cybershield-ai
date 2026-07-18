from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    average_precision_score,
    classification_report,
    confusion_matrix,
    ConfusionMatrixDisplay
)

import matplotlib.pyplot as plt


def evaluate_model(model, X_test, y_test, model_name):

    y_pred = model.predict(X_test)

    if hasattr(model, "predict_proba"):
        y_prob = model.predict_proba(X_test)[:,1]
    else:
        y_prob = None

    accuracy = accuracy_score(y_test,y_pred)
    precision = precision_score(y_test,y_pred)
    recall = recall_score(y_test,y_pred)
    f1 = f1_score(y_test,y_pred)

    if y_prob is not None:
        roc_auc = roc_auc_score(y_test,y_prob)
        pr_auc = average_precision_score(y_test,y_prob)
    else:
        roc_auc = None
        pr_auc = None

    print("="*60)
    print(model_name)
    print("="*60)

    print(f"Accuracy : {accuracy:.4f}")
    print(f"Precision: {precision:.4f}")
    print(f"Recall   : {recall:.4f}")
    print(f"F1 Score : {f1:.4f}")

    if roc_auc is not None:
        print(f"ROC AUC  : {roc_auc:.4f}")
        print(f"PR AUC   : {pr_auc:.4f}")

    print("\nClassification Report\n")
    print(classification_report(y_test,y_pred))

    cm = confusion_matrix(y_test,y_pred)

    disp = ConfusionMatrixDisplay(confusion_matrix=cm)

    disp.plot(cmap="Blues")

    plt.title(model_name)

    plt.show()

    return {
        "Accuracy":accuracy,
        "Precision":precision,
        "Recall":recall,
        "F1":f1,
        "ROC_AUC":roc_auc,
        "PR_AUC":pr_auc
    }