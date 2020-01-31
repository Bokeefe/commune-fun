module.exports = class Game {
  constructor(active, choices, users, isFinished) {
    this.active = active;
    this.choices = choices;
    this.users = users;
    this.isFinished = isFinished;
  }
}
