import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch"

import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  Upload,
  Pencil,
  Trash2,
  Plus,
  X,
} from "lucide-react";
import { useProduct } from "@/contexts/ProductContext";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Order, Customer, ProductForm } from "@/lib/types";
import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { formatDateBR } from "@/lib/utils";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { normalizeText } from "@/lib/utils";
import CreatableSelect from "react-select/creatable";

const Admin = () => {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const { products, categories, addProduct, updateProduct, removeProduct, reloadProducts, loading, error } = useProduct();
  const { authFetch, loading: loadingFetch, error: fetchError } = useAuthFetch();

  const [activeTab, setActiveTab] = useState<"products" | "orders" | "customers" | "messages" | "sellers">(
    "products"
  );
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [messages, setMessages] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);



  // ===== Autenticação =====
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // ===== Dados =====
  // const savedProds = localStorage.getItem("products");
  // if (savedProds) productsData = JSON.parse(savedProds);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const data = await authFetch<Order[]>({ url: "orders/" });
      setOrders(data);
    } catch (err) {
      console.error("Erro ao buscar pedidos:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchCustomers = async () => {
    setLoadingCustomers(true);
    try {
      const data = await authFetch<Customer[]>({ url: "customers/" });

      setCustomers(data);
    } catch (err) {
      console.error("Erro ao buscar clientes:", err);
    } finally {
      setLoadingCustomers(false);
    }
  };
  const fetchMessages = async () => {
    setLoadingCustomers(true);
    try {
      const data = await authFetch({ url: "messages/" });

      setMessages(data);

    } catch (err) {
      console.error("Erro ao buscar mensagens:", err);
    } finally {
      setLoadingCustomers(false);
    }
  };
  const fetchSellers = async () => {
    setLoadingCustomers(true);
    try {
      const data = await authFetch({ url: "users?role=seller" });

      setSellers(data);
      console.log(data);
    } catch (err) {
      console.error("Erro ao buscar vendedores:", err);
    } finally {
      setLoadingCustomers(false);
    }
  };

  // ===== Estado produtos =====
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState<ProductForm>({
    name: "",
    price: "",
    original_price: "",
    reseller_price: "",
    quantity: "",
    category: "",
    images: [],
    description: "",
    max_installments: "",
    sizes: "",
    highlight: false,
  });

  // ===== Funções utilitárias =====
  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      original_price: "",
      reseller_price: "",
      max_installments: "",
      quantity: "",
      category: "",
      images: [],
      description: "",
      sizes: "",
      highlight: false,
    });
    setEditingId(null);
  };

  const handleEditProduct = (product: any) => {
    setFormData({
      name: product.name,
      price: product.price.toString(),
      original_price: product.original_price?.toString() || "",
      reseller_price: product.reseller_price?.toString() || "",
      max_installments: product.max_installments || "",
      quantity: product.quantity.toString(),
      category: product.category,
      images: product.images || [],
      description: product.description || "",
      sizes: product.sizes ? product.sizes.join(", ") : "",
      highlight: product.highlight,
    });
    setEditingId(product.id);
    setIsDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!file.type.startsWith("image/")) {
        toast({ title: "Erro", description: "Selecione apenas imagens.", variant: "destructive" });
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "Erro", description: "Máximo 5MB por imagem.", variant: "destructive" });
        continue;
      }

      const reader = new FileReader();
      await new Promise<void>((resolve) => {
        reader.onload = () => {
          if (reader.result) newImages.push(reader.result as string);
          resolve();
        };
        reader.readAsDataURL(file);
      });
    }

    setFormData({ ...formData, images: [...formData.images, ...newImages] });
    toast({ title: "Imagens carregadas", description: "Sucesso!" });
  };

  const handleRemoveImage = (index: number) => {
    const updated = [...formData.images];
    updated.splice(index, 1);
    setFormData({ ...formData, images: updated });
  };

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.images.length === 0) {
      toast({ title: "Erro", description: "Adicione ao menos uma imagem.", variant: "destructive" });
      return;
    }

    const productData = {
      name: formData.name,
      price: parseFloat(formData.price),
      original_price: formData.original_price ? parseFloat(formData.original_price) : null,
      reseller_price: formData.reseller_price ? parseFloat(formData.reseller_price) : null,
      max_installments: formData.max_installments ? parseFloat(formData.max_installments) : null,
      quantity: parseFloat(formData.quantity),
      category: formData.category,
      images: formData.images,
      description: formData.description || null,
      sizes: formData.sizes
        ? formData.sizes.split(",").map((s) => s.trim())
        : null,
      highlight: formData.highlight,
    };

    if (editingId) {
      const index = products.findIndex((p) => p.id == parseInt(editingId));

      const resp = await updateProduct({ id: parseInt(editingId), ...productData });

      toast({ title: "Produto atualizado", description: "Produto atualizado com sucesso!" });
    } else {
      addProduct({ ...productData });

      toast({ title: "Produto criado", description: "Produto criado com sucesso!" });
    }

    // localStorage.setItem("products", JSON.stringify(productsData));
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDeleteProduct = (id: string) => {
    if (!confirm("Deseja realmente deletar este produto?")) return;
    const index = products.findIndex((p) => p.id == parseInt(id));
    products.splice(index, 1);
    // localStorage.setItem("products", JSON.stringify(initialProducts));
    removeProduct(parseInt(id));
    toast({ title: "Produto deletado", description: "Produto deletado com sucesso!" });
  };

  const handleDeleteSeller = (id: string) => {
    if (!confirm("Deseja realmente deletar este vendedor?")) return;
    const index = sellers.findIndex((p) => p.id == parseInt(id));
    sellers.splice(index, 1);
    // localStorage.setItem("products", JSON.stringify(initialProducts));
    
    toast({ title: "Vendedor deletado", description: "Produto deletado com sucesso!" });
  };

  const handleConfirmOrder = (order) => {
    if (!confirm(`Deseja confirmar o pedido ${order.id}?`)) return;

    order.items.forEach(el => {
      const estoque = products.find(it => it.id = el.id);
      updateProduct({ ...estoque, quantity: (estoque.quantity - el.quantity) });
    });
    order.status = 'finalizado';
    authFetch({ url: `orders/${order.id}`, method: 'PUT', body: order })

    toast({ title: "Pedido Confirmado", description: `O pedido ${order.id} foi confirmado com sucesso` });

  };
  const handleCancelOrder = (order) => {
    if (!confirm(`Deseja cancelar o pedido ${order.id}?`)) return;


    order.status = 'cancelado';
    authFetch({ url: `orders/${order.id}`, method: 'PUT', body: order })

    toast({ title: "Pedido Cancelado", description: `O pedido ${order.id} foi cancelado.` });

  };


  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsOrderDialogOpen(true);
  };

  const handleWhatsAppMessage = (name: string, number: string) => {
    let url = `https://wa.me/${number}?text=`;

    url += `Olá ${name.split(' ')[0]}, tudo bem? \n Entrando em contato a respeito do pedido feito em nosso catálogo. Tem um tempinho? `;
    window.open(url, '__blank');
  }

  // ===== Filtragem produtos =====
  const filteredProducts = products.filter((product) => {
    return normalizeText(product.name)?.includes(normalizeText(search)) || normalizeText(product.category)?.includes(normalizeText(search));
  });


  useEffect(() => {

    switch (activeTab) {
      case "orders": fetchOrders();
        break;
      case "customers": fetchCustomers();
        break;
      case "messages": fetchMessages();
        break;
      case "sellers": fetchSellers();
        break;
    }
  }, [activeTab]);
  // ===== Render =====
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <h1 className="text-4xl font-bold mb-2">Painel de Administração</h1>
          </div>

          {/* ===== Abas ===== */}
          <div className="flex gap-2 mb-6 border-b pb-2 overflow-auto">
            <Button
              variant={activeTab === "products" ? "default" : "outline"}
              onClick={() => setActiveTab("products")}
            >
              Produtos
            </Button>
            <Button
              variant={activeTab === "orders" ? "default" : "outline"}
              onClick={() => setActiveTab("orders")}
            >
              Pedidos
            </Button>
            <Button
              variant={activeTab === "customers" ? "default" : "outline"}
              onClick={() => setActiveTab("customers")}
            >
              Clientes
            </Button>
            <Button
              variant={activeTab === "messages" ? "default" : "outline"}
              onClick={() => setActiveTab("messages")}
            >
              Mensagens
            </Button>
            <Button
              variant={activeTab === "sellers" ? "default" : "outline"}
              onClick={() => setActiveTab("sellers")}
            >
              Vendedores
            </Button>
          </div>

          {/* ===== Conteúdo da Aba ===== */}
          {activeTab === "products" && (
            <div>

              {/* Botão Novo Produto */}
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <div className="md:flex items-center justify-between mb-6 gap-4">

                  {/* Pesquisa */}
                  <Input placeholder="Pesquisar por nome ou categoria..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-md mb-4" />

                  <DialogTrigger asChild>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">

                      <Button onClick={resetForm}>
                        <Plus className="mr-2 h-4 w-4" />
                        Novo Produto
                      </Button>
                    </div>
                  </DialogTrigger>
                </div>

                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{editingId ? "Editar Produto" : "Novo Produto"}</DialogTitle>
                  </DialogHeader>

                  <form onSubmit={handleSubmitProduct} className="space-y-4 overflow-y-auto max-h-[75vh] pr-2">
                    <div>
                      <Label>Nome</Label>
                      <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Preço à Vista</Label>
                        <Input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
                      </div>
                      <div>
                        <Label>Preço Revenda</Label>
                        <Input type="number" value={formData.reseller_price} onChange={e => setFormData({ ...formData, reseller_price: e.target.value })} />
                      </div>

                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Preço Parcelado</Label>
                        <Input type="number" value={formData.original_price} onChange={e => setFormData({ ...formData, original_price: e.target.value })} />
                      </div>
                      <div>
                        <Label>Máximo de Parcelas</Label>
                        <Input type="number" value={formData.max_installments} min={1} onChange={e => setFormData({ ...formData, max_installments: e.target.value })} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Estoque</Label>
                        <Input type="number" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} required />
                      </div>
                      <div>
                        <Label>Categoria</Label>
                        <CreatableSelect
                          options={categories.map(category => ({ value: category, label: category }))}
                          styles={{
                            control: (base) => ({
                              ...base,
                              backgroundColor: "primary"
                            }),
                            menu: (base) => ({
                              ...base,
                              backgroundColor: "background"
                            })
                          }}
                          value={{ value: formData.category, label: formData.category }} onChange={e => setFormData({ ...formData, category: e.value })}
                          required />

                        {/* <Input value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} required /> */}
                      </div>
                    </div>
                    {/* Upload múltiplas imagens */}
                    <div>
                      <Label htmlFor="image-upload">Upload de Imagens</Label>
                      <div className="flex items-center gap-4 flex-wrap">
                        <Button type="button" variant="outline" disabled={isUploading} onClick={() => document.getElementById("image-upload")?.click()}>
                          {isUploading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando...
                            </>
                          ) : (
                            <>
                              <Upload className="mr-2 h-4 w-4" /> Escolher Imagens
                            </>
                          )}
                        </Button>
                        <input id="image-upload" type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                        <div className="flex gap-2 flex-wrap mt-2">
                          {formData.images.map((img, idx) => img && (
                            <div key={idx} className="relative">
                              <img src={img} alt={`Preview ${idx + 1}`} className="h-16 w-16 object-cover rounded-md" />
                              <button type="button" onClick={() => handleRemoveImage(idx)} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1">
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label>Ou insira URLs das imagens (uma por linha)</Label>
                      <Textarea value={formData.images.join("\n")} onChange={(e) => setFormData({ ...formData, images: e.target.value.split("\n").map(url => url.trim()) })} />
                    </div>

                    <div>
                      <Label>Descrição</Label>
                      <Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <Label>Destaque</Label>
                        <p className="text-sm text-muted-foreground">
                          Marcar este produto como destaque
                        </p>
                      </div>

                      <Switch
                        checked={formData.highlight}
                        onCheckedChange={(value) => {
                          setFormData(prev => {
                            const updated = { ...prev, highlight: value }

                            return updated
                          })
                        }}
                      />

                    </div>

                    <div>
                      <Label>Tamanhos</Label>
                      <Input value={formData.sizes} onChange={e => setFormData({ ...formData, sizes: e.target.value })} placeholder="12,13,14..." />
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}> Cancelar </Button>
                      <Button type="submit" disabled={loading}>{loading ? "Enviando..." : (editingId ? "Atualizar" : "Criar")}</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>

              {filteredProducts.length === 0 && <p className="text-muted-foreground">Nenhum produto encontrado.</p>}

              <div className="grid gap-4">
                {filteredProducts.map(product => (
                  <Card key={product.id}>
                    <CardHeader>
                      <div className="md:flex justify-between">
                        <div className="flex gap-4">
                          <img src={product.images[0]} className="w-24 h-24 object-contain rounded" />
                          <div>
                            <CardTitle>{product.name}</CardTitle>
                            <CardDescription>{product.category} • R$ {product.price.toFixed(2)}</CardDescription>
                            {product.description && (<p className="text-sm text-muted-foreground line-clamp-3 whitespace-pre-line">{product.description}</p>)}
                            <p className="text-sm">Estoque: {product.quantity}</p>
                          </div>
                        </div>

                      </div>
                    </CardHeader>

                    <CardContent>

                      <div className="flex gap-2 justify-center md:justify-end">
                        <Button className="w-full sm:w-auto" size="sm" variant="outline" onClick={() => handleEditProduct(product)}><Pencil className="h-4 w-4" />Editar</Button>
                        <Button className="w-full sm:w-auto" size="sm" variant="destructive" onClick={() => handleDeleteProduct(String(product.id))}><Trash2 className="h-4 w-4" />Excluir</Button>
                      </div>
                    </CardContent>


                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div>

              <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
                <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      Detalhes do Pedido #{selectedOrder?.id}   -  {selectedOrder?.date && formatDateBR(selectedOrder?.date)}
                    </DialogTitle>
                  </DialogHeader>

                  {selectedOrder && (
                    <div className="space-y-6">

                      {/* Cliente */}
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Cliente</h3>
                        <p><strong>Nome:</strong> {selectedOrder.customer.name} </p>
                        <p><strong>Email:</strong> {selectedOrder.customer.email} </p>
                        <p className="flex"><strong>Telefone:</strong> {selectedOrder.customer.phone}
                          <Button title="Chamar no WhatsApp" className="h-5 w-5 mx-5" variant="link" onClick={() => handleWhatsAppMessage(selectedOrder.customer.name, selectedOrder.customer.phone)}>
                            <WhatsAppIcon className=" text-green-500" />
                          </Button> </p>
                        <p><strong>Endereço:</strong> {selectedOrder.shipping?.address}</p>

                      </div>

                      {/* Itens */}
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Itens</h3>
                        <div className="space-y-3">
                          {selectedOrder.items.map((item, index) => (
                            <div
                              key={index}
                              className="flex justify-between border rounded-md p-3"
                            >
                              <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  Quantidade: {item.quantity}
                                </p>
                              </div>
                              <div>
                                R$ {(item.price * item.quantity).toFixed(2)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Resumo */}
                      <div className="border-t pt-4">
                        <p><strong>Subotal:</strong> R$ {selectedOrder.subtotal.toFixed(2)}</p>
                        {selectedOrder.shipping.cost > 0 && (
                          <p><strong>Frete:</strong> R$ {selectedOrder.shipping.cost.toFixed(2)}</p>

                        )}
                        {selectedOrder.discount > 0 && (
                          <p><strong>Desconto:</strong> R$ {selectedOrder.discount.toFixed(2)}</p>

                        )}
                        <p><strong>Total:</strong> R$ {selectedOrder.total.toFixed(2)}</p>
                        <p><strong>Forma de pagamento:</strong> {selectedOrder.paymentMethod}</p>
                        <p><strong>Status:</strong> {selectedOrder.status}</p>

                      </div>

                    </div>
                  )}
                </DialogContent>
              </Dialog>

              <h2 className="text-2xl font-bold mb-4">Pedidos</h2>

              {loadingOrders ? (
                <p>Carregando pedidos...</p>
              ) : fetchError ? (
                <p className="text-red-600">{fetchError}</p>
              ) : orders.length === 0 ? (
                <p>Nenhum pedido encontrado.</p>
              ) : (
                orders
                  .sort((a, b) => b.id - a.id)
                  .map((order) => (
                    <Card key={order.id} className="mb-4">
                      <CardHeader>
                        <div className="md:flex justify-between items-center">
                          <div>
                            <CardTitle>Pedido #{order.id}</CardTitle>
                            <CardDescription>
                              <p>Cliente: {order.customer.name}</p>
                              <p>Telefone: {order.customer.phone}</p>
                              {order.seller && (<p>Vendedor: {order.seller}</p>)}
                            </CardDescription>
                            <p>Total: R$ {order.total.toFixed(2)}</p>
                          </div>

                          <div className="flex flex-col items-end gap-2">
                            <span>Status: {order.status || 'pendente'}</span>
                            {
                              (order.status == 'pendente') && (
                                <div className="grid grid-cols-3 gap-4 w-full">
                                  <Button
                                    variant="secondary"
                                    className="w-full"
                                    onClick={() => handleViewOrder(order)}
                                  >
                                    Ver Detalhes
                                  </Button>
                                  <Button
                                    onClick={() => handleCancelOrder(order)}
                                    variant="destructive"
                                    className="w-full opacity-50 hover:opacity-90"
                                  >
                                    Cancelar
                                  </Button>

                                  <Button
                                    onClick={() => handleConfirmOrder(order)}
                                    variant="outline"
                                    className="w-full"
                                  >
                                    Confirmar
                                  </Button>
                                </div>

                              )
                            }
                          </div>
                        </div>
                      </CardHeader>
                    </Card>

                  ))
              )}
            </div>
          )}


          {activeTab === "customers" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Clientes</h2>

              {loadingCustomers ? (
                <p>Carregando clientes...</p>
              ) : fetchError ? (
                <p className="text-red-600">{fetchError}</p>
              ) : customers.length === 0 ? (
                <p>Nenhum cliente encontrado.</p>
              ) : (
                customers.map((customer) => (
                  <Card key={customer.name} className="mb-4">
                    <CardHeader>
                      <div className="flex justify-between">
                        <div>
                          <CardTitle>{customer.name}</CardTitle>
                          <CardDescription>Email: {customer.email}</CardDescription>
                          <p>Telefone: {customer.phone}</p>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))
              )}
            </div>
          )}
          {activeTab === "messages" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Mensagens</h2>

              {loadingCustomers ? (
                <p>Carregando mensagens...</p>
              ) : fetchError ? (
                <p className="text-red-600">{fetchError}</p>
              ) : messages.length === 0 ? (
                <p>Você não tem mensagens.</p>
              ) : (
                messages
                  .sort((a, b) => b.id - a.id)
                  .map((message) => (
                    <Card key={message.id} className="mb-4">
                      <CardHeader>
                        <div className="flex justify-between">
                          <div>
                            <CardTitle>{message.name}</CardTitle>
                            <CardDescription className="text-primary">Email: {message.email}</CardDescription>
                            <p className="whitespace-pre-line m-4"> {message.message}</p>
                            <CardDescription>Enviada: {message.created}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))
              )}
            </div>
          )}
          {activeTab === "sellers" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Vendedores</h2>

              {loadingCustomers ? (
                <p>Carregando vendedores...</p>
              ) : fetchError ? (
                <p className="text-red-600">{fetchError}</p>
              ) : sellers.length === 0 ? (
                <p>Você não tem vendedores cadastrados.</p>
              ) : (
                sellers
                  // .sort((a, b) => b.id - a.id)
                  .map((message) => (
                    <Card key={message.id} className="mb-4">
                      <CardHeader>
                        <div className="flex justify-between">
                          <div>
                            <CardTitle>{message.name}</CardTitle>
                            <CardDescription className="text-primary">CPF: {message.cpf}</CardDescription>
                            <CardDescription className="text-primary">Email: {message.email}</CardDescription>
                            <CardDescription className="text-primary">Telefone: {message.phone}</CardDescription>

                          </div>
                        </div>
                      </CardHeader>
                      {/* <CardContent>
                        <div className="flex gap-2 justify-center md:justify-end">
                          <Button className="w-full sm:w-auto" size="sm" variant="outline" onClick={() => handleEditSeller(message)}><Pencil className="h-4 w-4" />Editar</Button>
                          <Button className="w-full sm:w-auto" size="sm" variant="destructive" onClick={() => handleDeleteSeller(String(message.id))}><Trash2 className="h-4 w-4" />Excluir</Button>
                        </div>
                      </CardContent> */}
                    </Card>
                  ))
              )}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Admin;
