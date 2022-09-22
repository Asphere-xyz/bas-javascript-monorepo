import { action, makeAutoObservable } from "mobx";

export default class ModalStore {
  /* -------------------------------------------------------------------------- */
  /*                                   States                                   */
  /* -------------------------------------------------------------------------- */
  public isVisible = false;
  public isLoading = false;

  public title: string | JSX.Element = "";
  public content: string | JSX.Element = "";

  constructor() {
    makeAutoObservable(this);
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Getters                                  */
  /* -------------------------------------------------------------------------- */

  /* -------------------------------------------------------------------------- */
  /*                                   Actions                                  */
  /* -------------------------------------------------------------------------- */
  @action
  setContent(content: string | JSX.Element) {
    this.content = content;
  }

  @action
  setTitle(title: string | JSX.Element) {
    this.title = title;
  }

  @action
  switchVisible() {
    this.isVisible = !this.isVisible;
  }

  @action
  setVisible(status: boolean) {
    this.isVisible = status;
  }

  @action
  switchLoading() {
    this.isLoading = !this.isLoading;
  }

  @action
  setIsLoading(status: boolean) {
    this.isLoading = status;
  }
}
