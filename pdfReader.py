import pdfplumber
import concurrent.futures
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
import spacy
import torch
from torch.cuda.amp import autocast

# Load SpaCy model
nlp = spacy.load('en_core_web_sm')

# Load DistilBART model and tokenizer from the transformers library
model = AutoModelForSeq2SeqLM.from_pretrained('sshleifer/distilbart-cnn-12-6')
tokenizer = AutoTokenizer.from_pretrained('sshleifer/distilbart-cnn-12-6')

def extract_text_from_page(page):
    return page.extract_text() or ""

def summarize_pdf(pdf_file_stream, summary_length=50, num_beams=4, segment_size=1024, batch_size=5):
    pdf_file_stream.seek(0)
    full_text = ""
    with pdfplumber.open(pdf_file_stream) as pdf:
        with concurrent.futures.ThreadPoolExecutor() as executor:
            # Extract text from each page in parallel
            page_texts = list(executor.map(extract_text_from_page, pdf.pages))
            full_text = " ".join(filter(None, page_texts))

    # Process in batches
    segments = [full_text[i:i + segment_size] for i in range(0, len(full_text), segment_size)]
    summaries = []
    for i in range(0, len(segments), batch_size):
        batch = segments[i:i + batch_size]
        batch_text = tokenizer(batch, return_tensors="pt", padding=True, truncation=True, max_length=segment_size)
        with autocast():
            summary_ids = model.generate(batch_text['input_ids'], num_beams=num_beams, max_length=summary_length, early_stopping=True)
            summaries.extend([tokenizer.decode(g, skip_special_tokens=True) for g in summary_ids])

    combined_summary = " ".join(summaries)

    # Process the combined summary with NLP to extract keywords
    doc = nlp(combined_summary)
    keywords = set([token.lemma_ for token in doc if token.is_alpha and not token.is_stop and token.pos_ in ['NOUN', 'PROPN']])
    key_entities = set([ent.text for ent in doc.ents if ent.label_ in ['ORG', 'PERSON', 'GPE', 'LOC']])

    # Combine keywords and key entities for a focused list of important terms
    important_keywords = list(keywords.union(key_entities))[:10]  # limit to top 10 most relevant terms

    return {
        "summary": combined_summary,
        "important_keywords": important_keywords
    }

# Note: You need to ensure that your environment supports CUDA for using AMP effectively.
