document.addEventListener('DOMContentLoaded', () => {
    fetch('questions.json')
        .then(response => response.json())
        .then(data => {
            const selectedQuestions = selectRandomQuestions(data, 4);
            initializeGame(selectedQuestions);
        })
        .catch(error => console.error('Error fetching questions:', error));

    function selectRandomQuestions(data, numQuestions) {
        const shuffled = data.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, numQuestions);
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function initializeGame(data) {
        const gameContainer = document.getElementById('game-container');
        
        data.forEach((questionData, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.classList.add('question');
            if (index === 0) questionDiv.classList.add('active');
            questionDiv.id = `question${index + 1}`;

            const questionTitle = document.createElement('h2');
            questionTitle.textContent = questionData.question;
            questionDiv.appendChild(questionTitle);

            const questionsColumn = document.createElement('div');
            questionsColumn.classList.add('column');
            questionsColumn.id = `q${index + 1}-questions`;

            // Shuffle items
            const shuffledItems = shuffleArray([...questionData.items]);
            shuffledItems.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('item');
                itemDiv.draggable = true;
                itemDiv.id = item.id;
                itemDiv.textContent = item.text;
                questionsColumn.appendChild(itemDiv);
            });

            const answersColumn = document.createElement('div');
            answersColumn.classList.add('column');
            answersColumn.id = `q${index + 1}-answers`;

            // Shuffle answers
            const shuffledAnswers = shuffleArray([...questionData.answers]);
            shuffledAnswers.forEach(answer => {
                const answerDiv = document.createElement('div');
                answerDiv.classList.add('dropzone');
                answerDiv.id = answer.id;
                answerDiv.textContent = answer.text;
                answersColumn.appendChild(answerDiv);
            });

            questionDiv.appendChild(questionsColumn);
            questionDiv.appendChild(answersColumn);

            if (index < data.length - 1) {
                const nextButton = document.createElement('button');
                nextButton.classList.add('next');
                nextButton.id = `next${index + 1}`;
                nextButton.textContent = 'Next';
                nextButton.addEventListener('click', () => showQuestion(index + 1));
                questionDiv.appendChild(nextButton);
            } else {
                const submitButton = document.createElement('button');
                submitButton.id = 'submit';
                submitButton.textContent = 'Submit';
                submitButton.addEventListener('click', () => calculateScore(data));
                questionDiv.appendChild(submitButton);
            }

            const resetButton = document.createElement('button');
            resetButton.classList.add('reset');
            resetButton.id = `reset${index + 1}`;
            resetButton.textContent = 'Reset';
            resetButton.addEventListener('click', () => resetCurrentQuestion(index + 1));
            questionDiv.appendChild(resetButton);

            gameContainer.appendChild(questionDiv);
        });

        // Initialize drag and drop functionality
        initializeDragAndDrop();
    }

    function initializeDragAndDrop() {
        const items = document.querySelectorAll('.item[draggable="true"]');
        const dropzones = document.querySelectorAll('.dropzone');

        items.forEach(item => {
            item.addEventListener('dragstart', dragStart);
        });

        dropzones.forEach(dropzone => {
            dropzone.addEventListener('dragover', dragOver);
            dropzone.addEventListener('drop', drop);
        });
    }

    function dragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.id);
        e.target.classList.add('dragging');
    }

    function dragOver(e) {
        e.preventDefault();
    }

    function drop(e) {
        e.preventDefault();
        const itemId = e.dataTransfer.getData('text/plain');
        const draggedElement = document.getElementById(itemId);
        const targetElement = e.target;

        if (targetElement.classList.contains('dropzone')) {
            targetElement.appendChild(draggedElement);
        }

        draggedElement.classList.remove('dragging');
    }

    function calculateScore(data) {
        console.log("Submit button clicked");
        let score = 0;

        data.forEach((questionData, index) => {
            questionData.items.forEach(item => {
                const itemElement = document.getElementById(item.id);
                const correctAnswer = questionData.answers.find(answer => answer.id === item.id.replace('item', 'answer'));
                const answerElement = document.getElementById(correctAnswer.id);

                console.log(`Checking item ${item.id} in answer ${correctAnswer.id}`);
                if (answerElement && answerElement.contains(itemElement)) {
                    console.log(`Item ${item.id} is correctly placed in ${correctAnswer.id}`);
                    score++;
                } else {
                    console.log(`Item ${item.id} is NOT correctly placed in ${correctAnswer.id}`);
                }
            });
        });

        console.log(`Score calculated: ${score}`);
        const scoreDisplay = document.getElementById('score');
        if (scoreDisplay) {
            scoreDisplay.textContent = `Your score: ${score} / ${data.reduce((acc, question) => acc + question.items.length, 0)}`;
        } else {
            console.error('Score display element not found');
        }
    }

    function resetCurrentQuestion(questionIndex) {
        const questionItems = document.querySelectorAll(`#question${questionIndex} .item`);
        const questionsColumn = document.getElementById(`q${questionIndex}-questions`);
        questionItems.forEach(item => {
            questionsColumn.appendChild(item);
        });
    }

    function showQuestion(index) {
        const questions = document.querySelectorAll('.question');
        questions.forEach((question, i) => {
            question.classList.toggle('active', i === index);
        });
    }
});