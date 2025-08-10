# Document Summarization Feature

## Overview
A new "סכם" (Summarize) button has been added to the LawSearch application that allows users to generate AI-powered summaries of legal documents using Cohere's language model.

## Features

### Backend Changes
- **New API Endpoint**: `/api/summarize_document`
- **CohereClient Integration**: Uses the existing `CohereClient` class with the `summarize` method
- **Request Format**: 
  ```json
  {
    "doc_id": "document_id_here"
  }
  ```
- **Response Format**:
  ```json
  {
    "doc_id": "document_id_here",
    "summary": "AI-generated summary in Hebrew",
    "success": true
  }
  ```

### Frontend Changes
- **Summarize Button**: Added to the document dialog with Hebrew text "סכם"
- **Loading State**: Shows "מסכם..." while processing
- **Summary Display**: Shows the AI-generated summary in a styled container
- **Error Handling**: Displays error messages if summarization fails
- **State Management**: Resets summary when opening new documents

## How to Use

1. **Search for Documents**: Use the search functionality to find legal documents
2. **Open Document**: Click on any document result to open the full document dialog
3. **Click Summarize**: Click the "סכם" button in the top-right of the dialog
4. **View Summary**: The AI-generated summary will appear above the full document content

## Technical Implementation

### Backend (Python/FastAPI)
```python
@app.post("/api/summarize_document")
async def summarize_document(request: SummarizeRequest):
    try:
        document = opensearch_client.get_document_by_id(request.doc_id)
        if document:
            summary = cohere_client.summarize(document.content)
            return {
                "doc_id": request.doc_id,
                "summary": summary,
                "success": True
            }
        else:
            return {"error": "Document not found", "success": False}
    except Exception as e:
        return {"error": str(e), "success": False}
```

### Frontend (React/TypeScript)
```typescript
const handleSummarize = async () => {
  setIsSummarizing(true);
  try {
    const response = await fetch('http://localhost:8501/api/summarize_document', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ doc_id: selectedCase.doc_id }),
    });
    const data = await response.json();
    if (data.success) {
      setSummary(data.summary);
    }
  } catch (error) {
    setSummaryError('שגיאה בסיכום המסמך');
  } finally {
    setIsSummarizing(false);
  }
};
```

## Dependencies
- **Backend**: `cohere` package (already in requirements.txt)
- **Frontend**: No additional dependencies required

## Configuration
- **Cohere API Key**: Configured in `app/cohere_client.py`
- **Model**: Uses "command-r" model for Hebrew text processing
- **Prompt**: Customized for legal document summarization in Hebrew

## Testing
Run the test script to verify the backend functionality:
```bash
python test_summarize.py
```

## Error Handling
- Network connection errors
- Document not found errors
- Cohere API errors
- Invalid document ID errors

All errors are displayed to the user in Hebrew with appropriate error messages. 