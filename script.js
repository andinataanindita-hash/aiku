const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Buat Tombol Suara secara Dinamis di UI
const chatInputArea = document.querySelector('.chat-input-area');
const voiceBtn = document.createElement('button');
voiceBtn.id = 'voice-btn';
voiceBtn.innerHTML = '🎙️';
voiceBtn.style.backgroundColor = '#2ec4b6';
voiceBtn.style.marginLeft = '0.5rem';
chatInputArea.appendChild(voiceBtn);

// Inisialisasi Fitur Pengenal Suara (Speech Recognition)
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = 'id-ID'; // Bahasa Indonesia
    recognition.continuous = false;
    recognition.interimResults = false;

    // Saat AI mendengarkan suara pengguna
    recognition.onstart = () => {
        voiceBtn.style.backgroundColor = '#e71d36'; // Warna merah saat merekam
        userInput.placeholder = "Mendengarkan suaramu...";
    };

    // Saat proses mendengarkan selesai
    recognition.onend = () => {
        voiceBtn.style.backgroundColor = '#2ec4b6';
        userInput.placeholder = "Ketik pertanyaan di sini...";
    };

    // Saat suara berhasil diubah menjadi teks
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        userInput.value = transcript;
        handleUserChat();
    };
} else {
    voiceBtn.disabled = true;
    voiceBtn.title = "Browser kamu tidak mendukung input suara.";
}

// Event Listeners
sendBtn.addEventListener('click', handleUserChat);

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleUserChat();
});

voiceBtn.addEventListener('click', () => {
    if (recognition) {
        recognition.start();
    } else {
        alert("Fitur suara tidak didukung di browser ini. Gunakan Google Chrome.");
    }
});

// Fungsi Utama Penanganan Chat
function handleUserChat() {
    const text = userInput.value.trim();
    if (text === '') return;

    appendMessage(text, 'user-message');
    userInput.value = '';

    setTimeout(() => {
        const aiResponse = getAIResponse(text);
        appendMessage(aiResponse, 'ai-message');
        
        // AI Bicara Mengeluarkan Suara
        speakText(aiResponse);
    }, 600);
}

function appendMessage(text, className) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', className);
    messageDiv.textContent = text;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Fungsi Fitur AI Suara (Text-to-Speech)
function speakText(text) {
    if ('speechSynthesis' in window) {
        // Hentikan suara sebelumnya jika masih berbicara
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'id-ID'; // Suara Bahasa Indonesia
        utterance.rate = 1.0;     // Kecepatan bicara
        utterance.pitch = 1.0;    // Nada suara

        window.speechSynthesis.speak(utterance);
    }
}

// Logika Jawaban Relevan (Karakter & Pengetahuan EduAI)
function getAIResponse(input) {
    const query = input.toLowerCase();

    // Jawaban Relevan Berdasarkan Kata Kunci
    if (query.includes('halo') || query.includes('hai') || query.includes('helo')) {
        return "Halo! Senang bisa bicara denganmu. Ada materi sekolah yang mau kita bahas?";
    } 
    else if (query.includes('siapa kamu') || query.includes('namamu')) {
        return "Aku EduAI, asisten pintar berbasis web yang siap membantu kamu belajar materi SMA dan SMK kelas 11!";
    }
    else if (query.includes('matematika') || query.includes('mtk')) {
        return "Untuk matematika kelas 11, kita bisa bahas matriks, fungsi komposisi, atau trigonometri. Kamu mau belajar bab yang mana?";
    } 
    else if (query.includes('coding') || query.includes('pemrograman') || query.includes('smk')) {
        return "Untuk jurusan RPL atau TKJ di SMK, penting sekali menguasai HTML, CSS, JavaScript, dan logika dasar algoritma!";
    }
    else if (query.includes('fisika')) {
        return "Fisika kelas 11 seru banget! Ada materi dinamika rotasi, fluida, hingga gelombang bunyi.";
    } 
    else if (query.includes('capek') || query.includes('pusing') || query.includes('lelah')) {
        return "Jangan lupa istirahat ya! Belajar itu penting, tapi menjaga kesehatan tubuh dan pikiran jauh lebih utama.";
    }
    else if (query.includes('terima kasih') || query.includes('makasih')) {
        return "Sama-sama! Tetap semangat belajarnya ya, kamu pasti bisa!";
    } 
    else {
        return `Kamu tadi bilang: "${input}". Pertanyaan yang menarik! Coba tanyakan seputar pelajaran sekolah atau tips belajar.`;
    }
}
