const answer = document.querySelector("#answer");
const invitation = document.querySelector("#invitation");
const yesButtons = document.querySelectorAll("#yes-btn, #also-yes-btn");
const backButton = document.querySelector("#back-btn");
const sendButton = document.querySelector("#send-btn");
const sendStatus = document.querySelector("#send-status");
const timeInputs = document.querySelectorAll('input[name="date-time"]');
const successModal = document.querySelector("#success-modal");
const successMessage = document.querySelector("#success-message");
const closeModalButton = document.querySelector("#close-modal-btn");

const TELEGRAM_ENDPOINT = "https://date-invitation.andylolka03.workers.dev";

function celebrate() {
  answer.hidden = false;
  answer.classList.add("show");
  invitation.setAttribute("aria-hidden", "true");

  for (let index = 0; index < 22; index += 1) {
    const heart = document.createElement("span");
    heart.className = "confetti-heart";
    heart.textContent = index % 3 === 0 ? "♡" : "♥";
    heart.style.left = `${Math.random() * 100}vw`;
    heart.style.fontSize = `${12 + Math.random() * 18}px`;
    heart.style.setProperty("--duration", `${2.8 + Math.random() * 2.2}s`);
    heart.style.animationDelay = `${Math.random() * 0.8}s`;
    document.body.append(heart);
    heart.addEventListener("animationend", () => heart.remove());
  }

  backButton.focus();
}

function returnToInvitation() {
  answer.hidden = true;
  answer.classList.remove("show");
  invitation.removeAttribute("aria-hidden");
  document.querySelector("#yes-btn").focus();
}

function showSuccessModal(selectedTime) {
  successMessage.textContent = `Тогда встречаемся в ${selectedTime}. Я всё подготовлю — до встречи ❤️`;
  successModal.hidden = false;
  document.body.classList.add("modal-open");
  closeModalButton.focus();
}

function closeSuccessModal() {
  successModal.hidden = true;
  document.body.classList.remove("modal-open");
  sendButton.focus();
}

async function sendSelectedTime() {
  const selectedTime = document.querySelector('input[name="date-time"]:checked')?.value;
  if (!selectedTime) return;

  sendButton.disabled = true;
  sendButton.textContent = "Отправляю…";
  sendStatus.textContent = "";

  try {
    if (!TELEGRAM_ENDPOINT) {
      throw new Error("Сервис отправки ещё не подключён");
    }

    const response = await fetch(TELEGRAM_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ time: selectedTime }),
    });

    if (!response.ok) throw new Error("Не удалось отправить ответ");

    sendButton.textContent = "Время подтверждено ✓";
    sendStatus.textContent = "Готово! Ответ уже отправлен ♡";
    showSuccessModal(selectedTime);
  } catch (error) {
    sendButton.disabled = false;
    sendButton.textContent = "Попробовать ещё раз";
    sendStatus.textContent = error.message;
  }
}

yesButtons.forEach((button) => button.addEventListener("click", celebrate));
backButton.addEventListener("click", returnToInvitation);
timeInputs.forEach((input) => {
  input.addEventListener("change", () => {
    sendButton.disabled = false;
    sendStatus.textContent = "";
  });
});
sendButton.addEventListener("click", sendSelectedTime);
closeModalButton.addEventListener("click", closeSuccessModal);
successModal.addEventListener("click", (event) => {
  if (event.target.classList.contains("success-modal__backdrop")) closeSuccessModal();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !successModal.hidden) closeSuccessModal();
});
