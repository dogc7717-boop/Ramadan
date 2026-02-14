:root {
    --gold: linear-gradient(180deg, #FFD700 0%, #B8860B 100%);
    --bg-dark: #0a0e17;
    --text-color: #ffffff;
    --accent: #9c27b0;
}

/* دعم الوضع الفاتح لو الموبايل مضبوط عليه */
@media (prefers-color-scheme: light) {
    :root {
        --bg-dark: #f5f5f5;
        --text-color: #1a1a1a;
        --accent: #673ab7;
    }
}

body {
    margin: 0; padding: 0;
    background: var(--bg-dark);
    color: var(--text-color);
    font-family: 'Cairo', sans-serif;
    display: flex; flex-direction: column; min-height: 100vh;
    transition: all 0.3s ease;
}

.main-circle {
    width: 200px; height: 200px;
    border: 6px solid var(--accent);
    border-radius: 50%;
    display: flex; justify-content: center; align-items: center;
    box-shadow: 0 0 20px var(--accent);
    cursor: pointer;
}

#counter { font-size: 5rem; font-weight: bold; color: #00ff88; }

nav {
    position: fixed; bottom: 0; width: 100%;
    background: rgba(0,0,0,0.9);
    display: flex; justify-content: space-around; padding: 15px 0;
}

.active { color: gold; font-weight: bold; }
