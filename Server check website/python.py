import requests
#for json writing
import json

ip = input('Enter minecraft server ip!: ')
try:
  data = requests.get(f'https://api.minetools.eu/ping/{ip}').json()
  #Write json file
  json_object = json.dumps(data, indent=4)
  with open("response.json", "w") as outfile:
    outfile.write(json_object)

  try:
    # data = requests.get(f'https://api.minetools.eu/ping/{ip}').json()
    print(f'Version: {data["version"]["name"]}')
    print(f'Players: {data["players"]["online"]} / {data["players"]["max"]}')
    try:
      playerlist = data['players']['sample']
      print('Players:')
      count = 0
      for i in playerlist:
        count += 1
        print(f"{count}: {i['name']}")
    except Exception as e:
      print('No player list available')
      print(e)
    print(f'Ping: {data["latency"]}ms')
  except:
    print('Server not found or down')
    print(data['error'])
except Exception as e:
  print(f'The requested url /ping/{ip} was not found')
  print(f'Exception: \n {e}')