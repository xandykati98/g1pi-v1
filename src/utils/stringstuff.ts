export const getSigla = (nome: string) => {
    const nomes = nome.split(" ");
    return nomes.map((n) => n[0]).join("");
}