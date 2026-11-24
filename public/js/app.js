const form = document.querySelector("#ticket-form");
const list = document.querySelector("#ticket-list");
const status = document.querySelector("#status");
const summary = document.querySelector("#summary");
const refreshButton = document.querySelector("#refresh-button");
const sendButton = document.querySelector("#send-button");
function setStatus(text, kind = "info") {
  status.textContent = text;
  status.dataset.kind = kind;
}
function renderTickets(items) {
  // TODO 1: очистите list и создайте карточку каждого обращения через createElement/textContent.
  // В карточке нужны номер #id, имя, текст проблемы и статус.
}
async function loadTickets() {
  // TODO 2: GET /api/tickets → проверка response.ok → response.json() → renderTickets(data.items).
  // Отобразите data.total в #summary; ошибки покажите через setStatus().
  setStatus("TODO: выполните GET-запрос");
}
async function createTicket(payload) {
  // TODO 3: POST /api/tickets с заголовком Content-Type: application/json.
  // Передайте JSON.stringify(payload); проверьте код ответа и прочитайте JSON.
}
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  // TODO 4: проверьте данные, отключите sendButton на период запроса,
  // вызовите createTicket(), очистите поля после успеха и обновите список через GET.
  setStatus("TODO: обработайте отправку формы");
});
refreshButton.addEventListener("click", loadTickets);
// TODO 5: вызовите loadTickets() при загрузке страницы.
function renderTickets(items) {
  list.replaceChildren();
  for (const ticket of items) {
    const card = document.createElement("article");
    card.className = "card";
    card.textContent = `#${ticket.id} · ${ticket.customer} · ${ticket.problem} · ${ticket.status}`;
    list.append(card);
  }
  if (!items.length) list.textContent = "Обращений пока нет";
}

async function loadTickets(message = "Список обновлён") {
  try {
    const response = await fetch("/api/tickets");
    if (!response.ok) throw new Error(`Ошибка загрузки: ${response.status}`);
    const data = await response.json();
    renderTickets(data.items);
    summary.textContent = `Всего обращений: ${data.total}`;
    setStatus(message, "success");
  } catch (error) {
    setStatus(error.message, "error");
  }
}

async function createTicket(payload) {
  const response = await fetch("/api/tickets", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(payload)
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Не удалось создать обращение");
  return result;
}

form.addEventListener("submit", async event => {
  event.preventDefault();
  const customer = form.elements.customer.value.trim();
  const problem = form.elements.problem.value.trim();
  if (customer.length < 2 || problem.length < 5) {
    setStatus("Введите имя от двух символов и описание от пяти", "error");
    return;
  }
  sendButton.disabled = true;
  try {
    const result = await createTicket({customer, problem});
    form.reset();
    await loadTickets(result.message);
  } catch (error) {
    setStatus(error.message, "error");
  } finally {
    sendButton.disabled = false;
  }
});
refreshButton.addEventListener("click", () => loadTickets());
loadTickets();
