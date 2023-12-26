// Inisialisasi variabel
let move_speed = 3, gravity = 0.5;
let droid = document.querySelector('.droid');
let img = document.getElementById('droid-1');
let sound_point = new Audio('point.mp3');
let sound_die = new Audio('die.mp3');
let backgroundSound = new Audio('backsound.mp3');

let droid_props = droid.getBoundingClientRect();
let background = document.querySelector('.background').getBoundingClientRect();
let score_val = document.querySelector('.score_val');
let message = document.querySelector('.message');
let score_title = document.querySelector('.score_title');
let game_state = 'Start';
img.style.display = 'none';
message.classList.add('messageStyle');
// Your existing JavaScript code
// ...

let currentBackgroundIndex = 0;
const backgroundImages = [
    'url("background.jpg")',
    'url("bg1.jpg")',
    'url("bg2.jpg")',
    // Add more background image URLs as needed
];

function changeBackground(direction) {
    if (game_state === 'Play') {
        // If the game is in progress, prevent changing the background
        return;
    }

    currentBackgroundIndex += direction;

    // Ensure the index stays within the bounds of the array
    if (currentBackgroundIndex < 0) {
        currentBackgroundIndex = backgroundImages.length - 1;
    } else if (currentBackgroundIndex >= backgroundImages.length) {
        currentBackgroundIndex = 0;
    }

    let backgroundElement = document.querySelector('.background');
    backgroundElement.style.backgroundImage = backgroundImages[currentBackgroundIndex];
}

// Your remaining JavaScript code
// ...




// Event listener untuk tombol Enter
document.addEventListener('keydown', (e) => {
    if (e.key == 'Enter' && game_state != 'Play') {
        // Hapus rintangan yang ada jika game belum dimulai
        document.querySelectorAll('.rintangan_game').forEach((e) => {
            e.remove();
        });

        // Tampilkan droid, atur posisinya, dan mulai game
        img.style.display = 'block';
        droid.style.top = '40vh';
        game_state = 'Play';
        message.innerHTML = '';
        score_title.innerHTML = 'Score : ';
        score_val.innerHTML = '0';
        message.classList.remove('messageStyle');
        startGame();
    }
    document.querySelector('.background h1').style.display = 'none';
});



// Fungsi utama untuk menjalankan permainan
function startGame() {
    // Putar suara latar belakang
    backgroundSound.play();

    let scoreIncrement = 5;
    let initialSpeed = move_speed;

    // Fungsi untuk animasi pergerakan rintangan
    function move() {
        if (game_state !== 'Play') return;

        let rintangan_game = document.querySelectorAll('.rintangan_game');
        rintangan_game.forEach((element) => {
            let rintangan_props = element.getBoundingClientRect();
            droid_props = droid.getBoundingClientRect();

            if (rintangan_props.right <= 0) {
                element.remove();
            } else {
                if (droid_props.left < rintangan_props.left + rintangan_props.width && droid_props.left + droid_props.width > rintangan_props.left && droid_props.top < rintangan_props.top + rintangan_props.height && droid_props.top + droid_props.height > rintangan_props.top) {
                    // Jika terjadi tabrakan, akhiri permainan
                    game_state = 'End';
                    message.innerHTML = 'Game Over'.fontcolor('red') + '<br>Score: ' + score_val.innerHTML + '<br>Tekan Enter untuk Mengulang';
                    message.classList.add('messageStyle');
                    img.style.display = 'none';
                    sound_die.play();
                    return;
                } else {
                    if (rintangan_props.right < droid_props.left && rintangan_props.right + move_speed >= droid_props.left && element.increase_score == '1') {
                        // Jika droid melewati rintangan, tambahkan skor
                        score_val.innerHTML = +score_val.innerHTML + 1;
                        sound_point.play();
                    }
                    element.style.left = rintangan_props.left - move_speed + 'px';
                }
            }
        });

        // Check if the score is a multiple of 5 and increase speed
        if (parseInt(score_val.innerHTML) % scoreIncrement === 0 && move_speed < 10) {
            move_speed += 1; // Increase speed
            scoreIncrement += 5; // Increase the threshold for the next speed increment
        }

        // Display the final score when the game is over
        if (game_state === 'End' && !score_title.innerHTML.includes('Final Score')) {
            score_title.innerHTML = 'Final Score : ';
            score_val.innerHTML = score_val.innerHTML;
        }

        requestAnimationFrame(move);
    }

    // Fungsi untuk memberikan efek gravitasi pada droid
    let droid_dy = 0;
    function apply_gravity() {
        if (game_state != 'Play') return;
        droid_dy = droid_dy + gravity;
        document.addEventListener('keydown', (e) => {
            if (e.key == 'ArrowUp' || e.key == ' ') {
                // Jika tombol panah atas atau spasi ditekan, beri efek lompat pada droid
                img.src = 'droid-2.png';
                droid_dy = -7.6;
            }
        });

        document.addEventListener('keyup', (e) => {
            if (e.key == 'ArrowUp' || e.key == ' ') {
                // Jika tombol panah atas atau spasi dilepas, kembalikan gambar droid ke kondisi awal
                img.src = 'droid.png';
            }
        });

        if (droid_props.top <= 0 || droid_props.bottom >= background.bottom) {
            // Jika droid menyentuh batas atas atau bawah layar, akhiri permainan
            game_state = 'End';
            message.style.left = '28vw';
            window.location.reload();
            message.classList.remove('messageStyle');
            return;
        }
        droid.style.top = droid_props.top + droid_dy + 'px';
        droid_props = droid.getBoundingClientRect();
        requestAnimationFrame(apply_gravity);
    }

    // Fungsi untuk membuat rintangan secara berkala
    let rintangan_separation = 0;
    let rintangan_gap = 35;

    function create_rintangan() {
        if (game_state != 'Play') return;

        if (rintangan_separation > 60) {
            rintangan_separation = 0;

            // Tentukan posisi rintangan secara acak
            let rintangan_posi = Math.floor(Math.random() * 43) + 8;
            let rintangan_game_inv = document.createElement('div');
            rintangan_game_inv.className = 'rintangan_game';
            rintangan_game_inv.style.top = rintangan_posi - 70 + 'vh';
            rintangan_game_inv.style.left = '100vw';

            document.body.appendChild(rintangan_game_inv);
            let rintangan_game = document.createElement('div');
            rintangan_game.className = 'rintangan_game';
            rintangan_game.style.top = rintangan_posi + rintangan_gap + 'vh'; // Fixed gap
            rintangan_game.style.left = '100vw';

            rintangan_game.increase_score = '1';

            document.body.appendChild(rintangan_game);
        }
        rintangan_separation++;
        requestAnimationFrame(create_rintangan);
    }

    requestAnimationFrame(apply_gravity);
    requestAnimationFrame(create_rintangan);
    requestAnimationFrame(move);
}

