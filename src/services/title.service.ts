class TitleService {
  public setTitle(title: string): void {
    document.title = title + " | PredictDb";
  }
}

export default new TitleService();
