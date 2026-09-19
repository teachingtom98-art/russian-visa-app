from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import json

malicious_payload = {
    "session": {
        "applicantName": "Applicant Name",
        "visaType": "tourist",
        "nationality": "British Citizen",
        "entries": "Single Entry",
        "tasks": [
            {
                "id": "t1",
                "title": "<img src=x onerror=alert('XSS_TITLE')>",
                "standardName": "01_Passport",
                "hint": "<img src=x onerror=alert('XSS_HINT')>",
                "status": "not-started",
                "source": "<img src=x onerror=alert('XSS_SOURCE')>",
                "sourceUrl": "javascript:alert('XSS_URL')",
                "verifiedDate": "<img src=x onerror=alert('XSS_DATE')>",
                "guidance": "<img src=x onerror=alert('XSS_GUIDANCE')>"
            }
        ]
    }
}

options = Options()
options.add_argument('--headless')
options.add_argument('--no-sandbox')
options.add_argument('--disable-dev-shm-usage')

service = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(service=service, options=options)

try:
    driver.get("http://localhost:8000")
    time.sleep(1)

    # Note: the validation checks for validSession.visaType etc... actually looking at loadSessionFromStorage:
    # it gets `raw = localStorage.getItem(STORAGE_KEY)` directly as currentSession if it exists. Let's just set the structure it expects
    raw_payload = {
        "applicantName": "Applicant Name",
        "visaType": "tourist",
        "nationality": "British Citizen",
        "entries": "Single Entry",
        "tasks": [
            {
                "id": "t1",
                "title": "<img src=x onerror=alert('XSS_TITLE')>",
                "standardName": "01_Passport",
                "hint": "<img src=x onerror=alert('XSS_HINT')>",
                "status": "not-started",
                "source": "<img src=x onerror=alert('XSS_SOURCE')>",
                "sourceUrl": "javascript:alert('XSS_URL')",
                "verifiedDate": "<img src=x onerror=alert('XSS_DATE')>",
                "guidance": "<img src=x onerror=alert('XSS_GUIDANCE')>"
            }
        ]
    }

    driver.execute_script("window.localStorage.setItem('russian_visa_workspace_session_v5', arguments[0]);", json.dumps(raw_payload))
    driver.refresh()
    time.sleep(1)

    WebDriverWait(driver, 5).until(
        EC.presence_of_element_located((By.CLASS_NAME, "task-item"))
    )

    try:
        alert = driver.switch_to.alert
        print(f"XSS Vulnerability found! Alert text: {alert.text}")
        alert.accept()
        exit(1)
    except:
        print("No alerts found - XSS payload did not execute (Good!)")

    title_elem = driver.find_element(By.CLASS_NAME, "task-title")
    print(f"Rendered Title Text: {title_elem.text}")
    if "<img src=x" in title_elem.text:
        print("Text was rendered correctly (escaped HTML shown to user)")
    else:
        print("Error: Expected text not shown to user")

    links = driver.find_elements(By.CLASS_NAME, "source-tag")
    if links:
        href = links[0].get_attribute("href")
        print(f"Source URL href is: {href}")
        if "javascript:" in href:
             print("Error: javascript: URI still present!")
             exit(1)
        else:
             print("Source URL sanitized correctly")
    else:
        print("Error: source link not found")

    print("All tests passed.")
finally:
    driver.quit()
