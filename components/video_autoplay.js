// VARIÁVEIS GLOBAIS
let youtubePlayer = null;
const videoId = 'xAR6N9N8e6U'; // O ID do seu vídeo
const DELAY_MS = 1000; // 1 segundo de atraso
const MODAL_VISTO_KEY = 'modalVideoVisto'; // Chave para o LocalStorage

// NOVO: TEMPO DE EXPIRAÇÃO DO MODAL (24 horas em milissegundos)
// Você pode mudar este valor para o que preferir:
// Exemplo: 1 hora: 60 * 60 * 1000
// Exemplo: 5 minutos: 5 * 60 * 1000
const MODAL_EXPIRATION_MS = 5 * 1000; // 25 minutos


// ===============================================
// 1. FUNÇÃO OBRIGATÓRIA DA API DO YOUTUBE
// ===============================================
function onYouTubeIframeAPIReady() {
    // 1.1. Inicializa o Player do YouTube
    youtubePlayer = new YT.Player('side-video', {
        // Usamos o ID do seu iframe
        videoId: videoId, 
        playerVars: {
            'autoplay': 0, 
            'controls': 1,
            'rel': 0,
            'showinfo': 0,
            'enablejsapi': 1,
            'modestbranding': 1 
        },
        events: {
            'onReady': onPlayerReady
        }
    });
}

function onPlayerReady(event) {
    console.log('Player do YouTube está 100% pronto para comandos.');
}


// ===============================================
// 2. Lógica do Gesto (Clique no Botão do Modal)
// ===============================================
document.addEventListener('DOMContentLoaded', () => {
    // 2.1. Referências aos Elementos
    const btnIniciarVideo = document.getElementById('btn-iniciar-video');
    const popupInteracao = document.getElementById('popup-interacao');

    // 2.2. LÓGICA DE TEMPO DE EXPIRAÇÃO
    const savedTimestamp = localStorage.getItem(MODAL_VISTO_KEY);
    const savedTime = parseInt(savedTimestamp, 10);
    const currentTime = Date.now();
    
    // Condição: O modal deve aparecer se NUNCA foi visto (!savedTime) 
    // OU se o tempo atual for maior que o tempo salvo + tempo de expiração.
    const shouldShowModal = !savedTime || (currentTime > savedTime + MODAL_EXPIRATION_MS);

    if (shouldShowModal) {
        // Modal deve aparecer: Mantemos ele visível (via CSS)
        // Se o seu CSS esconde por padrão, você pode descomentar esta linha:
        // if (popupInteracao) { popupInteracao.style.display = 'flex'; }
        console.log('Tempo de expiração atingido ou primeiro acesso. Exibindo modal.');

        if (btnIniciarVideo && popupInteracao) {
            btnIniciarVideo.addEventListener('click', () => {
                
                // **NOVO**: Salva o timestamp atual (em milissegundos)
                localStorage.setItem(MODAL_VISTO_KEY, Date.now().toString());
                
                // Oculta o modal imediatamente
                popupInteracao.style.display = 'none';

                console.log(`Permissão concedida. Novo timestamp salvo. Iniciando timer de ${DELAY_MS / 1000} segundos...`);
                
                // 2.3. Inicia o Timer para o Play
                setTimeout(() => {
                    if (youtubePlayer && typeof youtubePlayer.playVideo === 'function') {
                        youtubePlayer.playVideo();
                        console.log('Vídeo iniciado pelo timer!');
                    } else {
                        console.error('Player do YouTube não está pronto.');
                    }
                }, DELAY_MS); 
            });
        }
    } else {
        // Modal não deve aparecer: Escondemos ele imediatamente.
        if (popupInteracao) {
            popupInteracao.style.display = 'none';
        }
        const nextShowTime = savedTime + MODAL_EXPIRATION_MS;
        const remainingTimeSeconds = Math.round((nextShowTime - currentTime) / 1000);
        console.log(`Modal ainda está válido. Tempo restante: ${remainingTimeSeconds} segundos.`);
    }

    // ===============================================
    // 3. INJEÇÃO do Script da API do YouTube
    // ===============================================
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
});