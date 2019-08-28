import { Container, ContainerModule } from "inversify";
import "reflect-metadata";

export default function initializeContainer(modules: ContainerModule[]) {
  const container = new Container();
  modules.forEach(module => container.load(module));
  return container;
}
