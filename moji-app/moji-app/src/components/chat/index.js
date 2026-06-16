import React, { useState } from "react";
import { chatBot } from "../../services/chatBotService";
import axios from "axios";
import "./chat.scss";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Hàm kiểm tra xem user có hỏi về sản phẩm không
  const isProductQuery = (text) => {
    // Có thể mở rộng bằng AI, tạm thời kiểm tra từ khóa
    const keywords = [
      "kính ngủ",
      "chăn mền",
      "túi đa năng du lịch",
      "khăn mặt",
      "gấu bông",
      "bao túi quà",
      "dán tủ lạnh",
      "giá đỡ thìa",
      "hoa sáp",
      "tag",
    ];
    return keywords.some((kw) => text.toLowerCase().includes(kw));
  };

  const sendMessage = async () => {
    if (input.trim() === "") return;
    setLoading(true);

    if (isProductQuery(input)) {
      try {
        const res = await axios.get(
          "http://localhost:3001/api/gemini/chatProduct"
        );
        const allProducts = res.data;
        const keyword = input.toLowerCase();
        const filtered = allProducts.filter(
          (sp) => sp.tenSP && sp.tenSP.toLowerCase().includes(keyword)
        );
        let replyText = "";
        if (filtered.length === 0) {
          replyText = "Không tìm thấy sản phẩm phù hợp.";
        } else {
          replyText =
            `<div class='chat-product-list' style='display:flex;flex-direction:column;gap:10px;'>` +
            filtered
              .map(
                (sp) =>
                  `<a href='/san-pham/${sp.maSP
                  }' target='_blank' rel='noopener noreferrer' style='text-decoration:none;'>
                    <div class='chat-product-card' style='display:flex;align-items:center;gap:10px;padding:8px 6px;background:#f8f8f8;border-radius:10px;box-shadow:0 1.5px 6px #eee; border:1.2px solid rgba(146, 143, 143, 0.95);cursor:pointer;transition:box-shadow .2s;'>
                      <div style='flex-shrink:0;'>
                        <img src='http://localhost:3001${sp.anhSP?.[0] || "/image/default.jpg"
                  }' alt='${sp.tenSP
                  }' style='width:54px;height:54px;object-fit:cover;border-radius:8px;border:1.2px solid #f3b6c2;background:#f8f8f8;'/>
                      </div>
                      <div style='flex:1;display:flex;flex-direction:column;justify-content:center;'>
                        <div style='font-size:12px;color:#000;line-height:1.2; margin-bottom:2px;'>${sp.tenSP
                  }</div>
                        <div style='font-size:12px;color:#333;line-height:1.2;'>Giá: <b style="color:#000">${sp.giaTien?.toLocaleString()}đ</b></div>
                      </div>
                    </div>
                  </a>`
              )
              .join("") +
            "</div>";
        }
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: input, sender: "user" },
          { text: replyText, sender: "bot", isHtml: true },
        ]);
        setInput("");
      } catch (error) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: input, sender: "user" },
          { text: "Lỗi lấy dữ liệu sản phẩm.", sender: "bot" },
        ]);
        setInput("");
      } finally {
        setLoading(false);
      }
      return;
    }

    // Nếu không phải hỏi sản phẩm thì chat bình thường
    try {
      const response = await chatBot({ message: input });
      const replyText = response.reply;
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: input, sender: "user" },
        { text: replyText, sender: "bot" },
      ]);
      setInput("");
    } catch (error) {
      console.error("Error while chatting:", error);
    } finally {
      setLoading(false);
    }
  };
  const closeChat = () => {
    setIsOpen(false);
    setMessages([]);
  };

  return (
    <div className="position-fixed bottom-0 end-0 p-4 z-3">
      {/* Nút bật chat */}
      <button
        onClick={() => setIsOpen(true)}
        className="btn rounded-circle d-flex justify-content-center align-items-center text-white shake-on-hover"
        style={{ backgroundColor: "#0d6efd", width: "58px", height: "58px" }}
      >
        <i className="bi bi-chat-dots fs-2"></i>
      </button>

      {/* Khung chat nổi */}
      {isOpen && (
        <div
          className="modal-dialog modal-dialog-end m-0"
          style={{
            position: "fixed",
            bottom: "0px",
            right: "20px",
            width: "320px",
            zIndex: 9999,
          }}
        >
          <div className="modal-content shadow-lg custom-border">
            <div className="chat-header d-flex justify-content-between align-items-center">
              <h5 className="modal-title">NLSHOP</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={closeChat}
              ></button>
            </div>

            <div
              className="modal-body p-0"
              style={{ backgroundColor: "#f9f9f9" }}
            >
              <div
                className="chat-box px-3 py-2"
                style={{
                  maxHeight: "300px",
                  minHeight: "300px",
                  overflowY: "auto",
                }}
              >
                <p className="timestamp">
                  {new Date().toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  {new Date().toLocaleDateString("vi-VN")}
                </p>

                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`d-flex mb-3 ${msg.sender === "user"
                      ? "justify-content-end"
                      : "justify-content-start"
                      }`}
                  >
                    {msg.sender === "bot" && (
                      <img
                        src="/image/adminDefault.png"
                        alt="Bot"
                        className="avatar"
                      />
                    )}
                    <div className={`message ${msg.sender}`}>
                      {msg.sender === "bot" && (
                        <div className="bot-name">Moji</div>
                      )}
                      {/* Hiển thị HTML nếu là sản phẩm */}
                      {msg.isHtml ? (
                        <div dangerouslySetInnerHTML={{ __html: msg.text }} />
                      ) : (
                        <div style={{ whiteSpace: "pre-wrap" }}>{msg.text}</div>
                      )}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="d-flex justify-content-center text-muted">
                    <em>Đang soạn tin...</em>
                  </div>
                )}
              </div>

              <div className="chat-footer">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nhập tin nhắn..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") sendMessage();
                  }}
                />
                <button className="btn-chat" onClick={sendMessage}>
                  <i className="bi bi-send-fill"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
