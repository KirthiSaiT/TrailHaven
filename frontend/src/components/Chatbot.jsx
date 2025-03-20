'use client'
import Script from "next/script";

const ChatbotEmbed = () => {
    return (
        <>
            <Script
                src="https://app.thinkstack.ai/bot/thinkstackai-loader.min.js"
                strategy="lazyOnload"
                onLoad={() => {
                    console.log("Chatbot script loaded successfully");
                }}
            />
            <div className="fixed bottom-5 right-5 z-1000">
                <div id="chatbot-container"></div>
            </div>
        </>
    );
};

export default ChatbotEmbed;
