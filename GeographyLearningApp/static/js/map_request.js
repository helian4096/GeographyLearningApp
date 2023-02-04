var s = document.querySelectorAll('polyline');
var s = Array.from(s);
var alls = document.getElementById('outlines');
var map = document.getElementById('display_map').innerHTML;
console.log(map);
var id_string = "" + map + "_info";
var map_doc = JSON.parse(document.getElementById(id_string).innerHTML);
var country = document.getElementById('country');
var capital = document.getElementById('capital');
var capitalSubmit = document.getElementById('capitalSubmit');
var result = document.getElementById('result');
var score_display = document.getElementById('score_display');
var quiz_value = document.getElementById('quiz_info');
var save_button = document.getElementById('savetodb');
var quiz_name = "Capitals";
var score = 0;
var current_country = "";
var guess = "";
var guessing = false;
var answered = {};
var total = map_doc["total"];
var remaining = total;
var current_id = "";
var restart = false;
var correctlist = {};
var quiz_info;
var guessed;
var jsquiz;
guessed = total - remaining;
quiz_info = {
    "map": map,
    "quiz_name": quiz_name,
    "quiz_results": correctlist,
    "total_correct": score,
    "completed": guessed,
};
outlines.addEventListener('click', function(ev){
    if(!guessing){
        current_country = ev.path[0].getAttribute("name");
    }
    if(!guessing && !(current_country in answered) && (current_country !== null)){
        console.log(ev.path[0].getAttribute("id"));
        console.log(ev.path[0].getAttribute("name"));
        current_id = ev.path[0].getAttribute("id");
        country.innerHTML = "What is the capital of " + ev.path[0].getAttribute("name") + "?";
        console.log(country.innerHTML);
        console.log(current_country);
        guessing = true;
        answered[current_country] = false;
        document.getElementById(current_id).style.fill = "#00F";
        capital.value = '';
        result.innerHTML = '';
    }
});
capitalSubmit.addEventListener('click', function(ev){
    console.log(remaining);
    console.log(answered[current_country]);
    console.log(guessing);
    if((remaining > 0) && !(answered[current_country]) && guessing){
        remaining--;
        answered[current_country] = true;
        guess = capital.value;
        var correct = false;
        var actual = map_doc[current_country];
        var actual_capital = actual;
        console.log(actual);
        console.log(capital);
        var size;
        if(Array.isArray(actual)){
            actual_capital = "";
            actual.forEach(function(item, index, array){
                if(item.toLowerCase() === guess.toLowerCase()){
                    score++;
                    correct = true;
                    actual_capital = actual_capital + item + ", ";
                }
            });
            actual_capital = actual_capital.substring(0, actual_capital.length - 2);
        }
        else{
            if(actual.toLowerCase() === guess.toLowerCase()){
                score++;
                correct = true;
            }
        }
        score_display.innerHTML = "Score: " + score;
        if(correct){
            result.innerHTML = "Correct!";
            correctlist[current_country] = 1;
        }
        else{
            result.innerHTML = "Incorrect. Possible correct answers are: " + actual_capital;
            correctlist[current_country] = 0;
        }
        guessing = false;
        document.getElementById(current_id).style.fill = "#FFF";
        country.innerHTML = '';
        guessed = total - remaining;
        quiz_info["quiz_results"] = correctlist;
        quiz_info["total_correct"] = score;
        quiz_info["completed"] = guessed;
        jsquiz = JSON.stringify(quiz_info);
        quiz_value.value = jsquiz;
        if(remaining === 0){
            capitalSubmit.innerHTML = "Finish!";
            //figure out how to send info when finishing the quiz
        }
    }
    else if(remaining === 0 && !guessing && !restart){
        result.innerHTML = "Congratulations! You have finished the quiz!<br>Click restart if you would like to retry!";
        restart = true;
        capitalSubmit.innerHTML = "Restart";
        document.getElementById("save_message").innerHTML = "Save your progress using the button below! (auto save is not currently enabled)"
    }
    else if(remaining === 0 && !guessing && restart){
        location.reload();
    }
});
/*information to send back
    total correct answers (score), total guessed (total - remaining)
    list of countries with whether or not they were correct
*/