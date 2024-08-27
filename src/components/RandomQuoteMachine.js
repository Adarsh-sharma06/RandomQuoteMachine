import React, { useState, useEffect, useCallback } from 'react';
import './RandomQuoteMachine.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faQuoteLeft } from '@fortawesome/free-solid-svg-icons';

const RandomQuoteMachine = () => {
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const changeColors = useCallback(() => {
    const newRandomColor = getRandomColor();
    document.body.style.backgroundColor = newRandomColor;
    document.body.style.color = newRandomColor;
    setRandomColor(newRandomColor);
  }, []);

  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [randomColor, setRandomColor] = useState(getRandomColor());

  const fetchRandomQuote = useCallback(() => {
    setIsLoading(true);

    fetch('https://dummyjson.com/quotes')
      .then((response) => response.json())
      .then((data) => {
        const randomIndex = Math.floor(Math.random() * data.quotes.length);
        const randomQuote = data.quotes[randomIndex];

        if (randomQuote) {
          setQuote(randomQuote.quote);
          const authorName = randomQuote.author || 'Unknown';
          setAuthor(authorName);
        } else {
          setQuote('No quote found');
          setAuthor('Unknown');
        }

        setIsLoading(false);
        changeColors();
      })
      .catch((error) => {
        console.error(error);
        setQuote('Failed to fetch quote');
        setAuthor('Unknown');
        setIsLoading(false);
      });
  }, [changeColors]);

  const tweetQuote = () => {
    const tweetText = encodeURIComponent(`"${quote}" - ${author}`);
    const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;

    window.open(tweetUrl, '_blank');
  };

  const instagramQuote = () => {
    const instagramText = `"${quote}" - ${author}`;
    const instagramUrl = `https://www.instagram.com/create/story/?text=${encodeURIComponent(instagramText)}`;

    window.open(instagramUrl, '_blank');
  };

  useEffect(() => {
    fetchRandomQuote();
  }, [fetchRandomQuote]);

  return (
    <div>
      <div id="quote-box">
        {isLoading ? (
          <div className="loading">
            <p>Loading...</p>
          </div>
        ) : (
          <>
            <div className="quote-text">
              <FontAwesomeIcon icon={faQuoteLeft} />
              {quote}
            </div>
            <div className="quote-author">- {author}</div>
            <div className="buttons">
              <button
                id="new-quote"
                className="btn btn-primary"
                onClick={fetchRandomQuote}
                style={{ backgroundColor: randomColor }}
              >
                New Quote
              </button>
              <div className="social-media-buttons">
                <button
                  id="tweet-quote"
                  className="btn"
                  onClick={tweetQuote}
                  style={{ color: randomColor }}
                >
                  <FontAwesomeIcon icon={faTwitter} alt="Twitter Icon" />
                </button>
                <button
                  id="instagram-quote"
                  className="btn"
                  onClick={instagramQuote}
                  style={{ color: randomColor }}
                >
                  <FontAwesomeIcon icon={faInstagram} alt="Instagram Icon" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="footer">by <a href='https://adarsh-sharma06.github.io/Portfolio/' target='_blank' rel='noreferrer'>Adarsh</a></div>
    </div>
  );
};

export default RandomQuoteMachine;
