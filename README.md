# Децентрализованная система голосования
## Стек
* JavaScript
* React
* Solidity
* Ganache
* Truffle
* Metamask

## Требования
* Node.js
* Ganache
* Truffle

## Развертывание
Установка сети фреймворка(необходим node.js):
```bash
sudo npm install -g ganache-cli
sudo npm install -g truffle
```
Развертывание

```bash
ganache-cli
```
```bash
truffle console --network development
truffle(development)> compile
truffle(development)> migrate
```

Указываем адрес смарт-контракта в frontend приложении.
В файле /voting-dapp-client/src/constants.js устанавливаем значение VOTING_APP_CONTRACT_ADDRESS = "<адрес опубликованного контракта>"

Запускаем frontend приложение 
```bash
cd voting-dapp-client
npm start
```