const statusElement = document.getElementById("backend-status");
const checkButton = document.getElementById("check-connection");

async function checkConnection() {
  checkButton.disabled = true;
  statusElement.textContent = "Проверяем соединение с backend…";

  try {
    const response = await fetch("/api/health", {
      cache: "no-store",
      signal: AbortSignal.timeout(5000)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const health = await response.json();

    if (health.application !== "BaseDesk" || health.status !== "ok") {
      throw new Error("Unexpected health response");
    }

    statusElement.textContent = "Backend доступен. Приложение готово к разработке.";
  } catch (error) {
    statusElement.textContent = "Не удалось подключиться к backend. Проверьте запуск приложения и повторите попытку.";
    console.error("Backend connection failed:", error);
  } finally {
    checkButton.disabled = false;
  }
}

checkButton.addEventListener("click", checkConnection);
checkConnection();
