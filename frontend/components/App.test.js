import React from "react";
import {fireEvent, render, screen , waitFor} from "@testing-library/react";
import AppFunctional from "./AppFunctional";

test('sanity', () => {
  expect(true).toBe(true)
})

test("çalışıyor mu", ()=>{
  render (<AppFunctional/>)
})

test("başlangıç koordinatları doğru mu", async()=>{
  render (<AppFunctional/>)

  const kareler = screen.getByText(/koordinatlar/i)
  expect(kareler).toHaveTextContent("(2,2)")
})

test("yukarı basınca koordinatlar doğru mu", async()=>{
  render (<AppFunctional/>)

  const up = screen.getByText(/koordinatlar/i)
  const upButton = screen.getByText("YUKARI")

  fireEvent.click(upButton);
  expect(up).toHaveTextContent("(2,1)")
})

test("2 kez yukarı basınca hata mesajı verıyor mu", async()=>{
  render (<AppFunctional/>)

  const mesaj = document.querySelector("#message")
  const upButton = screen.getByText("YUKARI")

  fireEvent.click(upButton);
  fireEvent.click(upButton);

  expect(mesaj).toHaveTextContent("Yukarıya gidemezsiniz")
})

test("hatalı mail girildiğinde hata mesajı verıyor mu", async ()=>{
  render (<AppFunctional/>)

  const mesaj = document.querySelector("#message")
  const mailInput = document.querySelector("#email")
  const button= document.querySelector("#submit")
  fireEvent.change(mailInput, {target:{value: "asdf@foo.bar"}});
  fireEvent.click(button)
  
  await waitFor(()=>{
    const message =screen.queryByText(/win/i);
    expect(message).toBeInTheDocument("Ouch: email must be a valid email")
  })
})

test(" mail girildiğinde başarı mesajı verıyor mu", async()=>{
  render (<AppFunctional/>)

  const mesaj = document.querySelector("#message")
  const mailInput = document.querySelector("#email")
  const button= document.querySelector("#submit")

  fireEvent.change(mailInput, {target:{value: "ahgahsj@gmail.com"}});
  fireEvent.click(button)

  await waitFor(()=>{
    const message =screen.queryByText(/win/i);
    expect(message).toBeInTheDocument("win")
  })
  
})
