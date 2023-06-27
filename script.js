var images = document.querySelectorAll(".placeholders img")
const w = "wagh.", m = "mendi."
const wagh_src = "images/wagh.jpg", mendi_src = "images/mendi.jpg",
    blank_src = "images/blank.png", active_src = "images/active.jpg"
var turn = w
var started = false
var selected = false
var remaining = 16
var selected_src = " "
var selected_img = null
var dead = 0
var count= 0
var wagh_bari = 0

var possible_ids = {
    "u-1-1": ["u-1-2", "u-2-1"],
    "u-1-2": ["u-1-1", "u-1-3", "u-2-2"],
    "u-1-3": ["u-1-2", "u-2-3"],
    "u-2-1": ["u-1-1", "u-2-2", "i-1-3"],
    "u-2-2": ["u-2-1", "u-2-3", "i-1-3", "u-1-2"],
    "u-2-3": ["u-2-2", "u-1-3", "i-1-3"],

    "i-1-1": ["i-1-2", "i-2-1"],
    "i-1-2": ["i-1-1", "i-1-3", "i-2-2"],
    "i-1-3": ["u-2-1", "u-2-2", "u-2-3", "i-1-2", "i-1-4", "i-2-2", "i-2-3", "i-2-4"],
    "i-1-4": ["i-1-3", "i-1-5", "i-2-4"],
    "i-1-5": ["i-1-4", "i-2-5"],

    "i-2-1": ["i-1-1", "i-3-1", "i-2-2"],
    "i-2-2": ["i-2-1", "i-1-2", "i-1-3", "i-2-3", "i-3-1", "i-3-2"],
    "i-2-3": ["i-2-2", "i-2-4", "i-1-3", "i-3-3"],
    "i-2-4": ["i-1-3", "i-1-4", "i-2-3", "i-2-5", "i-3-4", "i-3-5"],
    "i-2-5": ["i-1-5", "i-2-4", "i-3-5"],

    "i-3-1": ["i-2-1", "i-2-2", "i-3-2", "i-4-1", "i-4-2"],
    "i-3-2": ["i-3-1", "i-2-2", "i-3-3", "i-4-2"],
    "i-3-3": ["i-3-2", "i-3-4", "i-2-3", "i-4-3"],
    "i-3-4": ["i-3-3", "i-3-5", "i-2-4", "i-4-4"],
    "i-3-5": ["i-3-4", "i-2-5", "i-4-5", "i-2-4", "i-4-4"],

    "i-4-1": ["i-3-1", "i-4-2", "i-5-1"],
    "i-4-2": ["i-4-1", "i-3-1", "i-3-2", "i-5-2", "i-4-3", "i-5-3"],
    "i-4-3": ["i-4-2", "i-3-3", "i-5-3", "i-4-4"],
    "i-4-4": ["i-4-3", "i-5-3", "i-3-4", "i-5-4", "i-3-5", "i-4-5"],
    "i-4-5": ["i-3-5", "i-5-5", "i-4-4"],

    "i-5-1": ["i-4-1", "i-5-2"],
    "i-5-2": ["i-5-1", "i-4-2", "i-5-3"],
    "i-5-3": ["d-2-1", "d-2-2", "d-2-3", "i-5-2", "i-5-4", "i-4-2", "i-4-3", "i-4-4"],
    "i-5-4": ["i-5-3", "i-5-5", "i-4-4"],
    "i-5-5": ["i-5-4", "i-4-5"],

    "d-1-1": ["d-1-2", "d-2-1"],
    "d-1-2": ["d-1-1", "d-1-3", "d-2-2"],
    "d-1-3": ["d-1-2", "d-2-3"],
    "d-2-1": ["d-1-1", "d-2-2", "i-5-3"],
    "d-2-2": ["d-2-1", "d-2-3", "i-5-3", "d-1-2"],
    "d-2-3": ["d-2-2", "d-1-3", "i-5-3"],

}

var possible_moves = []

var killer_moves = {

}

const strBtn = document.getElementById("start-btn")
strBtn.addEventListener("click", function () {
    resetPlayground()
    strBtn.innerHTML = "Restart"
})

for (let i = 0; i < images.length; i++) {
    images[i].addEventListener("click", function () {
        if (started) {
            if(!selected && turn===m && remaining>0 && images[i].src.indexOf(blank_src) !== -1){
                images[i].src = mendi_src
                remaining=remaining-1
                document.getElementsByClassName("mendi-score")[0].innerHTML = "Remaining-" + remaining + "<br>dead-" + dead
                count=count+1
                if(count>=2){
                    turn=w
                }
            }
            else if (!selected && images[i].src.indexOf(turn) !== -1) {
                selected_src = images[i].src
                selected_img = images[i]
                images[i].style.border = "1px solid yellow"
                if(turn===m || wagh_bari>=1){
                    images[i].src = blank_src
                }
                selected = true
                getPossiblemoves(images[i])
            } else if (selected && images[i].src.indexOf(blank_src) !== -1 && selected_img != images[i]) {
                // check if curr position is in possible moves
                if (possible_moves.indexOf(images[i].id) > -1) {
                    if (killer_moves[images[i].id]) {
                        document.getElementById(killer_moves[images[i].id]).src = blank_src
                        dead = dead + 1
                        document.getElementsByClassName("mendi-score")[0].innerHTML = "Remaining-" + remaining + "<br>dead-" + dead
                    }
                    for (let i = 0; i < possible_moves.length; i++) {
                        document.getElementById(possible_moves[i]).style.border = "none"
                    }
                    possible_moves = []
                    killer_moves = {}
                    images[i].src = selected_src
                    selected_img.style.border = "none"
                    wagh_bari=wagh_bari + 1
                    if(wagh_bari>=2 || turn===m){
                        if (turn === "wagh.") turn = "mendi."
                        else turn = "wagh."    
                    }
                    selected = false
                }

            } else {
                if (selected) {
                    for (let i = 0; i < possible_moves.length; i++) {
                        document.getElementById(possible_moves[i]).style.border = "none"
                    }
                    possible_moves = []
                    killer_moves = {}
                    selected_img.src = selected_src
                    selected_img.style.border = "none"
                    selected = false
                    selected_src = " "
                    selected_img = null
                }
            }
        }
    })
}

function resetPlayground() {
    for (let i = 0; i < images.length; i++) {
        images[i].src = blank_src
        if (images[i].id === "i-3-3") {
            images[i].src = wagh_src
        }
        else if (images[i].id.match("i-[2-4]-[2-4]")) {
            images[i].src = mendi_src
        }
        images[i].style.border = "none"
    }
    started = true
    turn = w
    possible_moves = []
    killer_moves = {}
    remaining = 16
    selected = false
    selected_src=" "
    count=0
    wagh_bari=0
    document.getElementsByClassName("mendi-score")[0].innerHTML = "Remaining-" + remaining + "<br>dead-" + dead
}

function getPossiblemoves(image) {
    possible_moves = []
    killer_moves = {}
    let org_id = image.id
    let org_row = org_id[2]
    let org_col = org_id[4]
    let arr = possible_ids[org_id]
    for (let i = 0; i < arr.length; i++) {
        let curr_img = document.getElementById(arr[i])
        let curr_img_row = curr_img.id[2], curr_img_col = curr_img.id[4]

        if (curr_img.src.indexOf(blank_src) !== -1) {
            possible_moves.push(arr[i])
            document.getElementById(arr[i]).style.border = "1px solid green"
        }
         else {
            if (turn === w && curr_img.src.indexOf(wagh_src) === -1) {
                if((org_id==="i-5-3" || org_id==="i-1-3") && curr_img_row==2 && curr_img.id[0]!="i"){
                    possible_moves.push(curr_img.id[0] + "-" +(parseInt(curr_img_row)-1).toString() + "-" + curr_img_col)
                    document.getElementById(curr_img.id[0] + "-" +(parseInt(curr_img_row)-1).toString() + "-" + curr_img_col).style.border = "1px solid red"
                    killer_moves[curr_img.id[0] + "-" +(parseInt(curr_img_row)-1).toString() + "-" + curr_img_col] = curr_img.id
                }
                let rd = parseInt(org_row) - parseInt(curr_img_row)
                let nr = parseInt(curr_img_row) - rd
                let cd = parseInt(org_col) - parseInt(curr_img_col)
                let nc = parseInt(curr_img_col) - cd
                if (document.getElementById(curr_img.id[0] + "-" + nr.toString(10) + "-" + nc.toString(10))) {
                    possible_moves.push(curr_img.id[0] + "-" + nr.toString(10) + "-" + nc.toString(10))
                    if (document.getElementById(curr_img.id[0] + "-" + nr.toString(10) + "-" + nc.toString(10)).src.indexOf(blank_src) !== -1) {
                        document.getElementById(curr_img.id[0] + "-" + nr.toString(10) + "-" + nc.toString(10)).style.border = "1px solid red"
                    }
                    killer_moves[curr_img.id[0] + "-" + nr.toString(10) + "-" + nc.toString(10)] = curr_img.id
                } else {
                    if(curr_img.id==="i-1-3" || curr_img.id==="i-5-3"){
                        if (org_id[0] === 'i') {
                            if (nr.toString(10) > 5) {
                                possible_moves.push("d-" + 2 + "-" + (nc - 1).toString(10))
                                if(document.getElementById("d-" + 2 + "-" + (nc - 1).toString(10)).src.indexOf(blank_src) !== -1){
                                    document.getElementById("d-" + 2 + "-" + (nc - 1).toString(10)).style.border = "1px solid red"
                                }
                                killer_moves["d-" + 2 + "-" + (nc - 1).toString(10)] = curr_img.id
                            }
                            if (nr.toString(10) < 1) {
                                possible_moves.push("u-" + 2 + "-" + (nc - 1).toString(10))
                                if(document.getElementById("u-" + 2 + "-" + (nc - 1).toString(10)).src.indexOf(blank_src) !== -1){
                                    document.getElementById("u-" + 2 + "-" + (nc - 1).toString(10)).style.border = "1px solid red"
                                }
                                killer_moves["u-" + 2 + "-" + (nc - 1).toString(10)] = curr_img.id
                            }
                        } else {
                            if (nr.toString(10) > 5) {
                                possible_moves.push("i-" + 4 + "-" + (nc - 1).toString(10))
                                if(document.getElementById("i-" + 4 + "-" + (nc - 1).toString(10)).src.indexOf(blank_src)!==-1){
                                    document.getElementById("i-" + 4 + "-" + (nc - 1).toString(10)).style.border = "1px solid red"
                                }
                                killer_moves["i-" + 4 + "-" + (nc - 1).toString(10)] = curr_img.id
                            }
                            if (nr.toString(10) < 1) {
                                possible_moves.push("i-" + 2 + "-" + (nc - 1).toString(10))
                                if(document.getElementById("i-" + 2 + "-" + (nc - 1).toString(10)).src.indexOf(blank_src)!==-1){
                                    document.getElementById("i-" + 2 + "-" + (nc - 1).toString(10)).style.border = "1px solid red"
                                }
                                killer_moves["i-" + 2 + "-" + (nc - 1).toString(10)] = curr_img.id
                            }
                        }
                    }
                }
            }
        }
    }
} 

let heading3 = document.querySelector('.info-game h3')

heading3.addEventListener("click", function(e){
    
    let elm = document.querySelector(".info-game ol")
    if (!elm.checkVisibility()) {
        elm.style.display = "inline-block"
        elm.style.backgroundColor="#E0E0E0"
        elm.style.color="black"
        heading3.lastChild.remove()
        heading3.append(" Close Rules ^")

        if(window.screen.width<=940){
            document.querySelector("#grid-div").style.display = "none"
            document.querySelector(".placeholders").style.display="none"    
        }
    }else{
        heading3.lastChild.remove()
        heading3.append(" See Rules >")
        elm.style.display = "none"
        if(window.screen.width<=940){
            document.querySelector("#grid-div").style.display = "grid"
            document.querySelector(".placeholders").style.display="block"
        }
    }
})