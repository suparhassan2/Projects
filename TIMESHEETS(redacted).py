#TIMESHEETS by Supar Hassan 2023
#This script was created to automate submission of weekly contractor time sheets. All personal info has been redacted 


from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.action_chains import ActionChains

from time import sleep

#PATH = "C:\Program Files (x86)\chromedriver.exe"

options = Options()
options.add_experimental_option("detach", True)

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()),
                          options=options)

#credentials
username = "SAMPLE"
password = "SAMPLE"

driver.get("url link to site")

#sleep(10)

driver.find_element(By.ID,"usernameId_new").send_keys(username)
driver.find_element(By.ID,"passwordId_new").send_keys(password)
driver.find_element(By.NAME,"action").click()
driver.find_element(By.LINK_TEXT,"Complete Time Sheet").click()
driver.find_element(By.XPATH,"//input[contains(@name, 'TDWK00038726')]").send_keys("7.5")

n = 4
actions = ActionChains(webdriver.Chrome())

actions.send_keys(keys.TAB + "7.5" * 4)
actions.perform()

#driver.find_element("value id", "passwordId_new").send_keys(password)
#driver.find_element("name", "action").click()
##driver.find_element(By.NAME, 'username').send_keys(username)
#driver.find_element_id('usernameId_new').send_keys(123)
#time.sleep()
sleep(15)