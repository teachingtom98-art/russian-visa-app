from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import os
import sys

def test_xss():
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    # Disable cache to avoid testing cached versions
    chrome_options.add_argument("--disable-application-cache")
    chrome_options.add_argument("--disable-cache")

    driver = webdriver.Chrome(options=chrome_options)
    driver.execute_cdp_cmd('Network.clearBrowserCache', {})

    success = True
    try:
        # Create a malicious payload file
        payload_content = """{
          "workspace": "Russian Visa Planner",
          "schemaVersion": "5.0",
          "exportDate": "2023-10-24T12:00:00.000Z",
          "session": {
            "applicantName": "<script>document.body.innerHTML='XSS_APPLICANT'</script>",
            "visaType": "tourist",
            "nationality": "British Citizen",
            "entries": "Single Entry",
            "tasks": [
              {
                "id": "t1",
                "title": "<script>document.body.innerHTML='XSS_TITLE'</script>Valid Original Passport",
                "standardName": "01_Passport_Data_Page",
                "hint": "<img src=x onerror=document.body.innerHTML='XSS_HINT'>",
                "status": "not-started",
                "source": "MID Consular Regs<svg/onload=document.body.innerHTML='XSS_SOURCE'>",
                "sourceUrl": "javascript:document.body.innerHTML='XSS_SOURCE_URL'",
                "verifiedDate": "Aug 2026",
                "guidance": "Upload a clear scan."
              }
            ]
          }
        }"""
        payload_path = os.path.abspath('malicious_backup.json')
        with open(payload_path, 'w') as f:
            f.write(payload_content)

        driver.get("http://localhost:8000")

        # We need to send keys to hidden file input.
        file_input = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "importFileInput"))
        )
        file_input.send_keys(payload_path)

        # Wait a moment for import processing and rendering
        time.sleep(2)

        # Verify body doesn't contain XSS values indicating scripts ran
        body_text = driver.execute_script("return document.body.innerHTML;")

        # If the script successfully executed, it will replace body with XSS_* text.
        # Otherwise, the text will just be safely escaped and displayed along with the rest of the application body.
        # We check if XSS_TITLE is the only thing in body or if it replaced 'Valid Original Passport'

        if "XSS_APPLICANT" in body_text and "Valid Original Passport" not in body_text:
             print("FAIL: XSS SUCCESSFUL (Applicant)")
             success = False
        if "XSS_TITLE" in body_text and "Valid Original Passport" not in body_text:
             print("FAIL: XSS SUCCESSFUL (Title)")
             success = False
        if "XSS_HINT" in body_text and "Valid Original Passport" not in body_text:
             print("FAIL: XSS SUCCESSFUL (Hint)")
             success = False
        if "XSS_SOURCE" in body_text and "Valid Original Passport" not in body_text:
             print("FAIL: XSS SUCCESSFUL (Source)")
             success = False
        if "XSS_SOURCE_URL" in body_text and "Valid Original Passport" not in body_text:
             print("FAIL: XSS SUCCESSFUL (Source URL)")
             success = False

        if success:
             print("Test passed: No XSS payloads executed.")
        else:
             print("Test failed: XSS payloads executed.")
             sys.exit(1)

    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)
    finally:
        driver.quit()
        if os.path.exists(payload_path):
            os.remove(payload_path)

if __name__ == "__main__":
    test_xss()
