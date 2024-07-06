import { useCallback, useContext, useRef, useState } from "react";
import { PokerContext } from "../poker/PokerProvider";
import { Card } from "./Card";

export function ConfigurarCartas() {
    const { socket } = useContext(PokerContext) || {};
    const dialogRef = useRef<HTMLDialogElement | null>(null);
    const [cartas, setCartas] = useState<string[]>([]);
    const [novaCarta, setNovaCarta] = useState<string>("");
    const [isOpen, setIsOpen] = useState<boolean>(false);
  
    const toggleModal = useCallback(() => {
      if (!isOpen) {
        dialogRef?.current?.showModal();
      } else {
        dialogRef?.current?.close();
      }
  
      setIsOpen(!isOpen);
    }, [isOpen]);
  
    const configurarCartas = useCallback(() => {
      socket?.emit("setCartasPossiveis", cartas);
      toggleModal();
    }, [socket, cartas, toggleModal]);
  
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
                <label htmlFor="novaCarta">Carta:</label>
                <div className="gap flex">
                  <input
                    type="text"
                    name="novaCarta"
                    value={novaCarta}
                    list="emojis"
                    onChange={(e) => setNovaCarta(e.target.value)}
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
                      setCartas((v) => [...v, novaCarta]);
                      setNovaCarta("");
                    }}
                    className="rounded-e border-b border-e border-t border-slate-500 bg-slate-300"
                  >
                    Adicionar carta
                  </button>
                </div>
              </div>
              <p>Novas cartas:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {cartas?.map((v) => (
                  <Card symbol={v} mini key={`card-to-add-${v}`} cartasAbertas />
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
  