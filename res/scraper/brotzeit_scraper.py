#!/usr/bin/env python
# -*- coding: utf-8 -*-
import requests
from bs4 import BeautifulSoup
import collections
import re
import json

# set dataObj as OrderedDict
data = collections.OrderedDict()
id_counter = 0
item_list = []

old_keys = [
    'Brennwert', 'Fett', 'gesättigte Fettsäuren', 'einfach ungesät. Fettsäuren', 'mehrfach ungesät. Fettsäuren',
    'Kohlenhydrate', 'Zucker', 'Eiweiß', 'Salz', 'Alkohol', 'Ballaststoffe', 'Cholesterin', 'Natrium', 'Wasser',
    'Vitamin A', 'Vitamin B1', 'Vitamin B11', 'Vitamin B12', 'Vitamin B2', 'Vitamin B3', 'Vitamin B5', 'Vitamin B6',
    'Vitamin B7', 'Vitamin C', 'Vitamin D', 'Vitamin E', 'Vitamin K', 'Kalzium', 'Chlor', 'Kupfer', 'Fluor', 'Jod',
    'Eisen', 'Magnesium', 'Mangan', 'Phosphor', 'Kalium', 'Schwefel', 'Zink'
]
keys = [ 'Brennwert', 'Salz', 'Zucker', 'Fett', 'Eiweiß', 'Kohlenhydrate' ]

# set urls
urls = [
    # Brot
    'https://www.yazio.com/de/kalorientabelle/broetchen-weizen-weizenbroetchen.html',
    'https://www.yazio.com/de/kalorientabelle/breze-lauge-ihle-frischbaeck.html',
    'https://www.yazio.com/de/kalorientabelle/roggen-sauerteigbrot-migros.html',
    # Käse
    'https://www.yazio.com/de/kalorientabelle/obazda-bayerischer-brotzeit-kaese-alpenhain.html',
    'https://www.yazio.com/de/kalorientabelle/gouda-gutes-land.html',
    'https://www.yazio.com/de/kalorientabelle/emmentaler-45-fett-i-tr.html',
    'https://www.yazio.com/de/kalorientabelle/bergkaese-45-fett-i-tr.html',
    'https://www.yazio.com/de/kalorientabelle/camembert-kaese-60-fett-i-tr.html',
    # Wurst
    'https://www.yazio.com/de/kalorientabelle/bayerischer-leberkaese-ja.html',
    'https://www.yazio.com/de/kalorientabelle/blutwurst-rotwurst.html',
    # 'Gemüse'
    'https://www.yazio.com/de/kalorientabelle/radieschen-roh-frisch.html',
    'https://www.yazio.com/de/kalorientabelle/krautsalat-ofterdinger.html',
    'https://www.yazio.com/de/kalorientabelle/bayerischer-wurstsalat-gruninger.html',
    # alkoholfreie Getränke
    'https://www.yazio.com/de/kalorientabelle/hefeweizen-alkoholfrei-gutmann.html',
    'https://www.yazio.com/de/kalorientabelle/stilles-wasser-netto.html',
    'https://www.yazio.com/de/kalorientabelle/coca-cola-coke-koffeinhaltig.html',
    'https://www.yazio.com/de/kalorientabelle/zitronen-limonade-gut-guenstig-edeka.html',
    # alkoholische Getränke
    'https://www.yazio.com/de/kalorientabelle/helles-augustiner-braeu.html',
    'https://www.yazio.com/de/kalorientabelle/weizenbier-weissbier-hefeweizen-5-vol.html',
    'https://www.yazio.com/de/kalorientabelle/radler-neumarkter-lammsbraeu.html'
]

# connect to urls
for url in urls:
    response = requests.get(url)
    # Parse HTML and save to BeautifulSoup object
    soup = BeautifulSoup(response.text, "html.parser")

    #id
    id_counter += 1

    # name
    name = soup.find('h1').string
    #print('Bezeichnung: ' + name)
    #print('-----------')

    # amount
    amount = soup.findAll('option')[0].text
    # multiplier
    multiplyer = soup.find_all('input', class_='form-control')[1]['value']
    if multiplyer != '1':
        print('Bezeichnung: ' + name)
        print('-----------')
        print('Menge: ' + amount + ' x ' + multiplyer)
    #else:
        #print('Menge: ' + amount)

    #ingredients - tds == Nährwert-Tabelle
    tds = soup.find_all('td')
    # length immer durch drei teilbar, weil drei Einträge pro Zeile
    length = len(tds)

    #ingredients
    ingred = {}

    #fill ingred with all existing keys
    for key in keys:
        ingred[key] = 0
        ingred[key+"_gda_permille"] = 0

    counter = 0
    for td in tds:
        item = {}
        counter += 1
        if length%3 == 0:
            key = " ".join((td.text).split())
            key = key.strip('⌊')
            #print(key)
        if length%3 == 1:
            gda = " ".join((td.text).split())
            gda = gda.strip(" %")
            gda = re.sub(",", "", gda)
            if gda == "< 01":
                gda = 1
            gda = int(gda)
            #print(gda)
        if length%3 == 2:
            value = " ".join((td.text).split())
        if counter%3 == 0:
            if key in keys:
                # alles in Milligramm umechnen und zu int parsen
                if value.find(" mg") != -1:
                    value = value.strip(" mg")
                    value = re.sub(',[0-9]', '', value)
                    value = int(value)
                    #print("MILLIGRAMM")
                elif value.find(" g") != -1:
                    value = value.strip(" g")
                    if value == "0,0":
                        value = 0
                    elif value == "< 0,1":
                        value = 0
                    else:
                        value = re.sub('^0,', '', value) + "00"
                        value = re.sub(',', '', value)
                        value = int(value)
                    #print(value)
                else:
                    # Brennwert
                    print(value + "\n")

                ingred[key] = value
                ingred[key+"_gda_permille"] = gda
        length -= 1
    item["id"] = id_counter
    #print(id_counter)
    item["name"] = name
    item["amount"] = amount
    item["multiplier"] = multiplyer
    if id_counter < 10:
        item["img"] = "url(./res/img/svg/0"+ str(id_counter) +".svg)"
    else:
        item["img"] = "url(./res/img/svg/" + str(id_counter) + ".svg)"
    item["ingredients"] = ingred
    #print(item)
    item_list.append(item)
#print(item_list)



# hier wird die JSON-Datei erzeugt

print('--- printing ---')
with open('data.json', 'w', encoding='utf-8') as jsonf:
    json.dump(item_list, jsonf, indent=2,  ensure_ascii=False)
print('--- finished ---')
