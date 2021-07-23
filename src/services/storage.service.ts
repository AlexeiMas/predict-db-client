class StorageService {
  private storagePrefix = "imagen_therapeutics_";

  constructor() {
    this._storage = localStorage;
  }

  private _storage: Storage;

  public get storage(): Storage {
    return this._storage;
  }

  public set storage(value: Storage) {
    this._storage = value;
  }

  public set(key: string, value: any): void {
    this._storage.setItem(this.storagePrefix + key, value);
  }

  public get(key: string): any | undefined {
    return this.storage.getItem(this.storagePrefix + key);
  }

  public remove(key: string): void {
    this._storage.removeItem(this.storagePrefix + key);
  }

  public removeMany(keys: string[]): void {
    keys.forEach((key) => this._storage.removeItem(this.storagePrefix + key));
  }

  public clear(): void {
    this.removeMany([
      "user_name",
      "user_email",
      "access_token",
      "refresh_token",
      "access_token_expires",
      "refresh_token_expires",
      "is_authorized",
    ]);
  }

  public checkBool(key: string): boolean {
    const value = this.storage.getItem(this.storagePrefix + key);
    return value === "true";
  }
}

export default new StorageService();
