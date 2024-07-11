import { useCallback, useContext, useRef, useState } from "react";
import { PokerContext } from "../poker/PokerProvider";
import { Card } from "./Card";

export function ConfigurarCartas() {
  const { socket } = useContext(PokerContext) || {};
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [cards, setCards] = useState<string[]>([]);
  const [newCard, setNewCard] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleModal = useCallback(() => {
    if (!isOpen) {
      dialogRef?.current?.showModal();
    } else {
      dialogRef?.current?.close();
    }

    setIsOpen(!isOpen);
  }, [isOpen]);

  //TODO: trocar esse nome
  const configurarCartas = useCallback(() => {
    socket?.emit("setPossibleCards", cards);
    toggleModal();
  }, [socket, cards, toggleModal]);

  return (
    <>
      <div
        onClick={toggleModal}
        className="rounded-md bg-slate-500 p-4 transition-colors hover:cursor-pointer hover:bg-slate-700"
      >
        Configurar cartas
      </div>
      <div className="relative">
        <dialog
          className="absolute left-1/2 top-1/2 m-0 -translate-x-1/2 -translate-y-1/2 transform rounded-xl p-0 backdrop:bg-slate-950 backdrop:opacity-75"
          ref={dialogRef}
          onClick={(e) => {
            e.preventDefault();
            //ao clicar no backdrop
            if (e.target === dialogRef?.current) {
              toggleModal();
            }
          }}
        >
          <form method="dialog" className="flex w-[50vw] flex-col gap-4 p-4">
            <div className="flex w-full flex-grow flex-col gap-2">
              <label htmlFor="newCard">Carta:</label>
              <div className="gap flex">
                <input
                  type="text"
                  name="newCard"
                  value={newCard}
                  list="emojis"
                  onChange={(e) => setNewCard(e.target.value)}
                  placeholder="Digite o valor da nova carta..."
                  className="w-full rounded-s border border-slate-500 px-2"
                  maxLength={2}
                />
                <datalist id="emojis">
                  <option value="&#x2615;">:coffe:</option>
                  <option value="&#x1F921;">:clown:</option>
                  <option value="&#x1F600;">:grinning:</option>
                  <option value="&#x1F4A9;">:poop:</option>
                  <option value="&#x1F923;">:roll:</option>
                </datalist>
                <button
                  type="button"
                  onClick={() => {
                    setCards((v) => [...v, newCard]);
                    setNewCard("");
                  }}
                  className="rounded-e border-b border-e border-t border-slate-500 bg-slate-300"
                >
                  Adicionar carta
                </button>
              </div>
            </div>
            <p>Novas cartas:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {cards?.map((v) => (
                <Card symbol={v} mini key={`card-to-add-${v}`} cardsAreOpened />
              ))}
            </div>
            <button
              type="submit"
              onClick={configurarCartas}
              className="rounded border bg-green-200 p-2"
            >
              Salvar
            </button>
          </form>
        </dialog>
      </div>
    </>
  );
}
