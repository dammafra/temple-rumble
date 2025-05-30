import Button from '@ui/button'
import Input from '@ui/input'
import Text from '@ui/text'
import formatTimer from '@utils/format'
import { arrayUnion, doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore'
import FirebasApp from './app'

export default class Leaderboard {
  static instance = new Leaderboard()

  constructor() {
    if (Leaderboard.instance) return Leaderboard.instance
    this.db = getFirestore(FirebasApp.instance)

    this.element = document.querySelector('.leaderboard')

    this.timerText = new Text('#timer')

    this.title = new Text('.leaderboard h2')
    this.scoreTexts = [new Text('#score1'), new Text('#score2'), new Text('#score3')]

    this.input = new Input('.leaderboard input')
    this.submitButton = new Button('#submit')
  }

  async show(score) {
    this.element.classList.remove('!hidden')

    await this.refresh()

    this.title.show('bottom')
    this.scoreTexts.forEach((s, i) => s.show('bottom'))

    if (this.canSubmit(score)) {
      this.timerText.element.classList.add('!text-yellow-600', 'animate-pulse')

      this.input.show('top')
      this.submitButton.show('top')

      this.submitButton.onClick(async () => {
        await this.save({ name: this.input.get(), score })
        this.refresh()
        this.input.hide()
        this.submitButton.hide()
      })
    }
  }

  async hide() {
    this.title.hide()
    this.scoreTexts.map((s, i) => s.hide())
    this.input.hide()
    this.submitButton.hide()

    this.timerText.element.classList.remove('!text-yellow-600', 'animate-pulse')
  }

  async refresh() {
    this.scores = await this.get()
    this.scores.forEach((score, i) => {
      this.scoreTexts.at(i).set(`${score.name.substring(0, 3)} - ${formatTimer(score.score)}`)
    })
  }

  canSubmit(score) {
    return this.scores.length < 3 || this.scores.some(s => s.score < score)
  }

  async save(score) {
    const docRef = doc(this.db, 'leaderboard/scores')

    await updateDoc(docRef, {
      scores: arrayUnion(score),
    })

    this.refresh()
  }

  async get() {
    return getDoc(doc(this.db, 'leaderboard/scores'))
      .then(res => res.data())
      .then(data => data.scores.sort((s1, s2) => s2.score - s1.score).slice(0, 3))
  }
}
