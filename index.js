// 설정부분

// 디스코드 유저 아이디 적는곳
let discordUserId = "1066387501108969582"

// failback image (디스코드 서버 터지면 보여줄 사진)
let failbackProfileImage = "https://cdn.discordapp.com/attachments/1067405999780147201/1071051641563918396/a5e21b2a1f89e6134d22c639fe5c6c96.png"

// 설정부분 끝



// fetch function
async function fetchAsync (url) {
    let response = await fetch(url)
    let data = await response.json()
    return data
}

// 바닥에서 뜨는 메시지
let snakbar = document.getElementById("snakbar")
let snakbarContent = document.getElementById("snakbar-content")
let snakbarCount = 0
function showSnakbar(message) {
    snakbar.classList.add("open")
    snakbarContent.textContent = message
    let nowCount = ++snakbarCount
    setTimeout(()=>{
        if (nowCount == snakbarCount) {
            snakbar.classList.remove("open")
        }
    },4000)
}

// 디코상태 정하기
let discordName = false
async function discordMain() {
    const profilePictureImage = document.getElementById("profile-picture")
    const profileStatus = document.getElementById("profile-status")
    const profileName = document.getElementById("profile-name")
    const profileTag = document.getElementById("profile-tag")
    const discordButton = document.getElementById("discord-button")
    
    function failback() {
        console.log("Failed to loading user information from discord api! try to set user data with default data (FAILBACK)")
        profileStatus.setAttribute("status","none")
        profilePictureImage.setAttribute("src",failbackProfileImage)
        profileName.textContent = "Helmet"
    }

    try {
        let discordData = (await fetchAsync(`https://api.lanyard.rest/v1/users/${discordUserId}`))?.data
        // console.log(discordData)
        if (discordData) {
            // 상태
            profileStatus.setAttribute("status",discordData.discord_status)

            let user = discordData.discord_user
            if (user) {
                // 프로필 이미지 설정
                let avatar = user.avatar
                profilePictureImage.setAttribute("src",
                    `https://cdn.discordapp.com/avatars/${discordUserId}/${avatar}.${avatar.startsWith("a_") ? "gif" : "png"}?size=2048`
                )

                // 이름설정
                profileName.textContent = user.username
                profileTag.textContent = '#'+user.discriminator

                // 클립보드에 이름 복사
                if (discordButton) {
                    discordName = `${user.username}#${user.discriminator}`
                    discordButton.addEventListener('click',()=>{
                        navigator.clipboard.writeText(discordName)
                        showSnakbar("클립보드에 복사됨 ^o^")
                    })
                }
            }
        } else { failback() }
    } catch (err) {
        console.log(err)
        failback()
    }
}
discordMain()