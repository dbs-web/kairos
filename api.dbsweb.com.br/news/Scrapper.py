import re
import requests
import newspaper
from newspaper import Article
from bs4 import BeautifulSoup, SoupStrainer
from urllib.parse import urljoin


class Scrapper:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) APpleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.66"
        }
        self.urls = set()
        #self.regex = regex

    def scrape(self, url):
        try:
            response = self.session.get(url, timeout=10)
            response.raise_for_status()  # Lança um erro se a requisição falhar

            soup = BeautifulSoup(response.text, 'html.parser')
            
            article = None
            article_tags = ['article', 'main', 'section']
            i = 0
            while not article and i < len(article_tags):
                article = soup.find(article_tags[i])
                i += 1

            
            txts = set()
            if article:
                allowed_tags = ['p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a','strong', 'div']
                
                for element in article.find_all(True):  # True encontra todas as tags
                    if element.name not in allowed_tags:
                        element.decompose()  # Remove o elemento da árvore DOM

                text_parts = []
                for element in article.descendants:
                    if isinstance(element, str):
                        text_parts.append(element.strip())  # Apenas o texto puro
                        continue
                    elif element.name == 'a':
                        text_parts.append(element.get_text().strip())
                        continue
                    elif element.name in allowed_tags:
                        curr_text = element.get_text(separator="\n", strip=True).strip()
                        nospaces = curr_text.replace(" ","")
                        if len(nospaces) and nospaces not in txts:
                            text_parts.append(curr_text)
                            txts.add(nospaces)

                text = ' '.join(text_parts).strip()

            else:
                text = "Article tag not found"

            return {
                'text': text
            }

        except Exception as e:
            raise Exception(f'Erro na requisição: {e}')    
